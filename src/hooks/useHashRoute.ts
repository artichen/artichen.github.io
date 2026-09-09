import { useEffect, useState } from "react";
import type { Page } from "../data/site";

export const pages: { id: Page; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "cv", label: "CV" },
  { id: "blog", label: "Blog" },
  { id: "miscellany", label: "Miscellany" },
];

export function readRoute(): Page | "not-found" {
  const value =
    window.location.hash.replace(/^#\/?/, "").replace(/\/$/, "") || "home";
  return pages.some((page) => page.id === value)
    ? (value as Page)
    : "not-found";
}

// Hash 路由无需服务器重写，刷新 /#/cv 与浏览器前进后退均适用于 GitHub Pages。
export function useHashRoute() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const handleChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", handleChange);
    return () => window.removeEventListener("hashchange", handleChange);
  }, []);
  return route;
}
