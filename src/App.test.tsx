// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import Blog from "./pages/Blog";
import CV from "./pages/CV";
import Home from "./pages/Home";
import { Portrait, SocialLinks } from "./components/Shared";
import * as dataModule from "./data/site";
import { siteData } from "./data/site";
import { filterPosts, localAsset, safeExternalUrl } from "./utils";

beforeEach(() => {
  window.history.replaceState(null, "", "/#/home");
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Navigation and page states", () => {
  it("loads the mock profile and navigates between all four pages", async () => {
    render(<App />);
    expect(screen.getByRole("status").textContent).toContain("Loading");
    await screen.findByRole("heading", { name: "Yuhan Chen", level: 1 });
    for (const [label, heading] of [
      ["CV", "Curriculum vitae"],
      ["Blog", "Blog"],
      ["Miscellany", "Miscellany"],
      ["Home", "Yuhan Chen"],
    ]) {
      await userEvent.click(screen.getByRole("link", { name: label }));
      await screen.findByRole("heading", { name: heading, level: 1 });
      expect(
        screen.getByRole("link", { name: label }).getAttribute("aria-current"),
      ).toBe("page");
    }
  });
  it("supports a direct CV route and handles unknown routes", async () => {
    window.history.replaceState(null, "", "/#/cv");
    render(<App />);
    await screen.findByRole("heading", { name: "Curriculum vitae", level: 1 });
    window.location.hash = "#/missing";
    await screen.findByRole("heading", { name: "Page not found" });
  });
  it("opens the hamburger menu and closes it with Escape", async () => {
    render(<App />);
    await screen.findByRole("heading", { name: "Yuhan Chen", level: 1 });
    await userEvent.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );
    expect(
      screen.getByRole("navigation", { name: "Expanded navigation" }),
    ).toBeTruthy();
    await userEvent.keyboard("{Escape}");
    expect(
      screen.queryByRole("navigation", { name: "Expanded navigation" }),
    ).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );
  });
  it("recovers from a mock loader failure", async () => {
    vi.spyOn(dataModule, "loadSiteData").mockRejectedValueOnce(
      new Error("Load failed"),
    );
    render(<App />);
    await screen.findByRole("alert");
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    await screen.findByRole("heading", { name: "Yuhan Chen", level: 1 });
  });
});

describe("Blog search and missing content", () => {
  it("searches case-insensitively, handles zero results, and clears the query", async () => {
    render(<Blog data={siteData} />);
    await userEvent.type(screen.getByLabelText("Search notes"), "retrieval");
    expect(screen.getByRole("status").textContent).toContain("1 note");
    await userEvent.clear(screen.getByLabelText("Search notes"));
    await userEvent.type(
      screen.getByLabelText("Search notes"),
      "no-such-topic",
    );
    expect(
      screen.getByRole("heading", { name: "No matching notes" }),
    ).toBeTruthy();
    await userEvent.click(
      screen.getAllByRole("button", { name: "Clear search" })[0],
    );
    expect(screen.getByRole("status").textContent).toContain("2 notes");
    expect(filterPosts(siteData.posts, "RETRIEVAL")).toHaveLength(1);
  });
  it("handles empty collections and optional fields", () => {
    const { unmount } = render(
      <Home data={{ ...siteData, projects: [], interests: [] }} />,
    );
    expect(
      screen.getByRole("heading", { name: "Projects to follow" }),
    ).toBeTruthy();
    unmount();
    render(<Blog data={{ ...siteData, posts: [] }} />);
    expect(
      screen.getByRole("heading", { name: "No notes published yet" }),
    ).toBeTruthy();
    expect(filterPosts([{ id: "empty" }], "query")).toEqual([]);
  });
  it("falls back when a local portrait fails to load", () => {
    render(
      <Portrait
        profile={{ ...siteData.profile, photo: "images/missing.jpg" }}
      />,
    );
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByText("Portrait unavailable")).toBeTruthy();
  });
  it("never invents accounts and rejects non-HTTPS account URLs", () => {
    const { unmount } = render(<SocialLinks profile={siteData.profile} />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    unmount();
    render(
      <SocialLinks
        profile={{
          ...siteData.profile,
          github: "https://github.com/example-user",
        }}
      />,
    );
    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "https://github.com/example-user",
    );
    expect(safeExternalUrl("javascript:alert(1)")).toBeUndefined();
    expect(localAsset("https://example.com/photo.jpg")).toBeUndefined();
    vi.stubEnv("BASE_URL", "./");
    expect(
      new URL(localAsset("files/cv.pdf")!, "https://example.test/portfolio/")
        .pathname,
    ).toBe("/portfolio/files/cv.pdf");
    vi.unstubAllEnvs();
  });
});

describe("CV downloads", () => {
  it("downloads a validated PDF and reports success", async () => {
    const pdf = new TextEncoder().encode("%PDF-1.7\nTest").buffer;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, arrayBuffer: async () => pdf }),
    );
    const create = vi.fn().mockReturnValue("blob:test");
    Object.defineProperty(URL, "createObjectURL", {
      value: create,
      configurable: true,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      value: vi.fn(),
      configurable: true,
    });
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    render(<CV data={siteData} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Download sample CV" }),
    );
    await screen.findByText("Your PDF download has started.");
    expect(create).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
  });
  it.each(["network", "404", "html"])(
    "shows a retry action for a %s failure",
    async (failure) => {
      const fetchMock = vi.fn();
      if (failure === "network")
        fetchMock.mockRejectedValue(new TypeError("Offline"));
      else
        fetchMock.mockResolvedValue({
          ok: failure !== "404",
          arrayBuffer: async () => new TextEncoder().encode("<html>").buffer,
        });
      vi.stubGlobal("fetch", fetchMock);
      render(<CV data={siteData} />);
      await userEvent.click(
        screen.getByRole("button", { name: "Download sample CV" }),
      );
      await screen.findByRole("alert");
      await userEvent.click(
        screen.getByRole("button", { name: "Retry download" }),
      );
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    },
  );
  it("disables downloading when no CV has been added", () => {
    render(<CV data={{ ...siteData, cv: { ...siteData.cv, path: "" } }} />);
    expect(
      (
        screen.getByRole("button", {
          name: "CV not added yet",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
});
