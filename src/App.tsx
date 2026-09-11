import { useEffect, useRef, useState } from "react";
import { loadSiteData } from "./data/site";
import type { SiteData } from "./data/site";
import { pages, useHashRoute } from "./hooks/useHashRoute";
import {
  Arrow,
  EmptyState,
  ErrorBoundary,
  SocialLinks,
} from "./components/Shared";
import Home from "./pages/Home";
import CV from "./pages/CV";
import Blog from "./pages/Blog";
import Miscellany from "./pages/Miscellany"
import s from "./App.module.css";


export default function App() {
  const route = useHashRoute();
  const [data, setData] = useState<SiteData | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const previousRoute = useRef(route);

  useEffect(() => {
    let active = true;
    setFailed(false);
    loadSiteData()
      .then((value) => {
        if (active) setData(value);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  useEffect(() => {
    setMenuOpen(false);
    document.title = `${pages.find((page) => page.id === route)?.label || "Page not found"} — ${data?.profile.name || "Academic profile"}`;
    if (previousRoute.current !== route) {
      window.scrollTo({ top: 0, behavior: "instant" });
      mainRef.current?.focus({ preventScroll: true });
      previousRoute.current = route;
    }
  }, [route, data?.profile.name]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  return (
    <div className={s.site}>
      <a
        className={s.skipLink}
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className={s.header}>
        <a href="#/home" className={s.brand} aria-label="Yuhan Chen home">
          <span className={s.brandMark}>{data?.profile.initials || "YC"}</span>
          <span>{data?.profile.name || "Yuhan Chen"}</span>
        </a>
        <div className={s.navigation}>
          <nav aria-label="Main navigation" className={s.desktopNav}>
            {pages.map((page) => (
              <a
                key={page.id}
                href={`#/${page.id}`}
                aria-current={route === page.id ? "page" : undefined}
              >
                {page.label}
              </a>
            ))}
          </nav>
          <div className={s.menuWrap} ref={menuRef}>
            <button
              ref={menuButtonRef}
              className={s.menuButton}
              aria-label={
                menuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              aria-controls="page-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path d="m6 6 12 12M6 18 18 6" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
            {menuOpen && (
              <nav
                id="page-menu"
                className={s.menu}
                aria-label="Expanded navigation"
              >
                <span className={s.menuLabel}>EXPLORE</span>
                {pages.map((page, index) => (
                  <a
                    key={page.id}
                    href={`#/${page.id}`}
                    onClick={() => setMenuOpen(false)}
                    aria-current={route === page.id ? "page" : undefined}
                  >
                    <span>0{index + 1}</span>
                    {page.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>
      </header>
      <main id="main-content" ref={mainRef} tabIndex={-1} className={s.main}>
        <ErrorBoundary key={route}>
          {failed ? (
            <div role="alert">
              <EmptyState title="The profile could not be loaded">
                <p>Please try again.</p>
                <button
                  className={s.button}
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  Retry
                </button>
              </EmptyState>
            </div>
          ) : !data ? (
            <div className={s.loading} role="status">
              Loading profile…
            </div>
          ) : route === "home" ? (
            <Home data={data} />
          ) : route === "cv" ? (
            <CV data={data} />
          ) : route === "blog" ? (
            <Blog data={data} />
          ) : route === "miscellany" ? (
            <Miscellany data={data} />
          ) : (
            <EmptyState title="Page not found">
              <p>This page does not exist.</p>
              <a href="#/home">Return home</a>
            </EmptyState>
          )}
        </ErrorBoundary>
      </main>
      <footer className={s.footer}>
        <div>
          <a href="#/home" className={s.footerName}>
            {data?.profile.name || "Yuhan Chen"}
          </a>
          <p>Mathematics. Machine learning. Finance.</p>
        </div>
        <div className={s.footerRight}>
          {data && <SocialLinks profile={data.profile} />}
          <span>
            © {new Date().getFullYear()} {data?.profile.name || "Yuhan Chen"}
          </span>
        </div>
      </footer>
      {data?.isDraft && (
        <div className={s.draftNote}>
          
        </div>
      )}
      {showTop && (
        <button
          className={s.backToTop}
          aria-label="Back to top"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
            });
            mainRef.current?.focus({ preventScroll: true });
          }}
        >
          <Arrow direction="up" />
        </button>
      )}
    </div>
  );
}
