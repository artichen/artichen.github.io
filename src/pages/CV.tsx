import { useEffect, useRef, useState } from "react";
import type { SiteData } from "../data/site";
import {
  Arrow,
  EmptyState,
  PageHeading,
  SocialLinks,
} from "../components/Shared";
import { localAsset } from "../utils";
import s from "../App.module.css";

export default function CV({ data }: { data: SiteData }) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const controller = useRef<AbortController | null>(null);
  const path = localAsset(data.cv.path);
  useEffect(() => () => controller.current?.abort(), []);

  async function downloadCV() {
    if (!path || status === "loading") return;
    setStatus("loading");
    controller.current = new AbortController();
    const timeout = window.setTimeout(() => controller.current?.abort(), 15000);
    try {
      // 检查 HTTP 状态及 PDF 文件头，避免误下载 404 页面或 SPA 的 HTML。
      const response = await fetch(path, { signal: controller.current.signal });
      if (!response.ok) throw new Error("File unavailable");
      const bytes = await response.arrayBuffer();
      if (new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-")
        throw new Error("Invalid PDF");
      const url = URL.createObjectURL(
        new Blob([bytes], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = data.cv.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
    }
  }

  return (
    <>
      <PageHeading
        eyebrow="BACKGROUND & EXPERIENCE"
        title="Curriculum vitae"
        description="Education, technical foundations, and areas of focus."
      />
      <div className={s.downloadPanel}>
        <div>
          <h2>
            {data.cv.isSample
              ? "CV · sample document"
              : "Curriculum vitae · PDF"}
          </h2>
          <p>
            {data.cv.isSample
              ? "A draft is available to preview. A verified CV will replace it."
              : "Download a copy of my curriculum vitae."}
          </p>
        </div>
        <button
          className={s.button}
          onClick={downloadCV}
          disabled={!path || status === "loading"}
        >
          <Arrow direction="down" />
          {status === "loading"
            ? "Downloading…"
            : !path
              ? "CV not added yet"
              : data.cv.isSample
                ? "Download sample CV"
                : "Download CV"}
        </button>
      </div>
      <div aria-live="polite" className={s.downloadStatus}>
        {status === "success" && "Your PDF download has started."}
      </div>
      {status === "error" && (
        <div className={s.errorNotice} role="alert">
          The PDF could not be downloaded. Check your connection and try again.
          <button onClick={downloadCV} className={s.textButton}>
            Retry download
          </button>
        </div>
      )}
      <section className={s.section}>
        <div className={s.sectionHeading}>
          <h2>Education</h2>
          <span>01</span>
        </div>
        {data.education.length ? (
          data.education.map((item) => (
            <article key={item.institution} className={s.cvEntry}>
              <h3>{item.institution}</h3>
              {item.qualification && (
                <p className={s.qualification}>{item.qualification}</p>
              )}
              {item.detail && <p>{item.detail}</p>}
            </article>
          ))
        ) : (
          <EmptyState title="Education details to follow" />
        )}
      </section>
      <section className={s.section}>
        <div className={s.sectionHeading}>
          <h2>Technical foundations</h2>
          <span>02</span>
        </div>
        {data.skills.length ? (
          data.skills.map((group) => (
            <div className={s.skillRow} key={group.label}>
              <h3>{group.label}</h3>
              <p>{group.items.join(" · ") || "Details to follow"}</p>
            </div>
          ))
        ) : (
          <EmptyState title="Skills to follow" />
        )}
      </section>
      <section className={s.section}>
        <div className={s.sectionHeading}>
          <h2>Research & career interests</h2>
          <span>03</span>
        </div>
        <p>
          Machine learning systems, AI agent development, quantitative research,
          and quantitative development.
        </p>
        <p className={s.sectionIntro}>
          Project experience and supporting repositories can be found on the{" "}
          <a href="#/home">home page</a>.
        </p>
      </section>
      <section className={s.section}>
        <div className={s.sectionHeading}>
          <h2>Find me online</h2>
          <span>04</span>
        </div>
        <SocialLinks profile={data.profile} />
        {data.profile.email && (
          <p className={s.email}>
            <a href={`mailto:${data.profile.email}`}>{data.profile.email}</a>
          </p>
        )}
      </section>
    </>
  );
}
