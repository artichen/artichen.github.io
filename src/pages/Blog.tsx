import { useState } from "react";
import type { SiteData } from "../data/site";
import { EmptyState, PageHeading } from "../components/Shared";
import { filterPosts } from "../utils";
import s from "../App.module.css";

export default function Blog({ data }: { data: SiteData }) {
  const [query, setQuery] = useState("");
  const posts = filterPosts(data.posts, query);
  return (
    <>
      <PageHeading
        eyebrow="NOTES & IDEAS"
        title="Blog"
        description="Thinking through machine learning, statistics, and finance."
      />
      <div className={s.searchArea}>
        <label htmlFor="blog-search">Search notes</label>
        <div className={s.searchBox}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" />
          </svg>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a topic or keyword…"
          />
          {query && (
            <button aria-label="Clear search" onClick={() => setQuery("")}>
              ×
            </button>
          )}
        </div>
      </div>
      <div className={s.resultCount} role="status">
        {posts.length} {posts.length === 1 ? "note" : "notes"}
        {query.trim() ? ` matching “${query.trim()}”` : ""}
        {data.isDraft ? " " : ""}
      </div>
      {!data.posts.length ? (
        <EmptyState title="No notes published yet">
          <p>Future notes will appear here.</p>
        </EmptyState>
      ) : !posts.length ? (
        <EmptyState title="No matching notes">
          <p>Try another topic or clear your search.</p>
          <button className={s.textButton} onClick={() => setQuery("")}>
            Clear search
          </button>
        </EmptyState>
      ) : (
        posts.map((post) => (
          <article className={s.blogPost} key={post.id}>
            <p className={s.eyebrow}>
              {post.category || "Notes"}
              {data.isDraft ? " " : ""}
            </p>
            <h2>{post.title || "Untitled note"}</h2>
            {post.summary && <p>{post.summary}</p>}
            <details className={s.details}>
              <summary>Read note</summary>
              <div className={s.postBody}>
                {post.paragraphs?.length ? (
                  post.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>This note has no body content yet.</p>
                )}
              </div>
            </details>
          </article>
        ))
      )}
    </>
  );
}
