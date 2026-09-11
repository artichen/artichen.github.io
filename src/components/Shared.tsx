import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Component, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import type { SiteData } from "../data/site";
import { localAsset, safeExternalUrl } from "../utils";
import s from "../App.module.css";

export function Arrow({
  direction = "diagonal",
}: {
  direction?: "diagonal" | "up" | "down";
}) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {direction === "diagonal" ? (
        <path d="M6 18 18 6M6 6h12v12" />
      ) : direction === "up" ? (
        <path d="m5 12 7-7 7 7M12 5v15" />
      ) : (
        <path d="m5 12 7 7 7-7M12 19V4" />
      )}
    </svg>
  );
}

export function SocialLinks({ profile }: { profile: SiteData["profile"] }) {
  return (
    <div className={s.socialLinks}>
      {(["github", "linkedin"] as const).map((key) => {
        const url = safeExternalUrl(profile[key]);
        const label = key === "github" ? "GitHub" : "LinkedIn";
        const Icon = key === "github" ? FaGithub : FaLinkedin;

        return url ? (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} profile (opens in a new tab)`}
          >
            <Icon
              className={`${s.socialIcon} ${
                key === "github" ? s.githubIcon : s.linkedinIcon
              }`}
              aria-hidden="true"
            />
            <span>{label}</span>
          </a>
        ) : (
          <span
            key={key}
            className={s.pending}
            title="Profile link has not been added yet"
          >
            {label}
            <span className={s.pendingLabel}></span>
          </span>
        );
      })}
    </div>
  );
}

export function Portrait({ profile }: { profile: SiteData["profile"] }) {
  const [failed, setFailed] = useState(false);
  const path = localAsset(profile.photo);
  return (
    <figure className={s.portrait}>
      {path && !failed ? (
        <img
          src={path}
          alt={profile.photoAlt || `Portrait of ${profile.name}`}
          width="300"
          height="340"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className={s.portraitPlaceholder}
          role="img"
          aria-label="Reserved space for a personal portrait"
        >
          <span className={s.portraitLabel}>PERSONAL PROFILE</span>
          <span className={s.monogram}>{profile.initials || "YC"}</span>
          <span className={s.photoCaption}>
            {failed ? "Portrait unavailable" : "Portrait to follow"}
            <span>01 / PROFILE</span>
          </span>
        </div>
      )}
      <figcaption>{profile.location || "Location to be added"}</figcaption>
    </figure>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className={s.pageHeading}>
      <p className={s.eyebrow}>{eyebrow}</p>
      <h1>{title}</h1>
      {description && <p className={s.pageDescription}>{description}</p>}
    </header>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className={s.emptyState}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

// 渲染错误由边界统一接管，避免整页白屏；异步错误仍在各自函数中 catch。
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(_error: Error, _info: ErrorInfo) {
    /* 生产站点可在这里接入错误上报。 */
  }
  render() {
    return this.state.failed ? (
      <div role="alert" className={s.emptyState}>
        <h2>Something went wrong</h2>
        <p>Please reload this page to try again.</p>
        <button className={s.button} onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
