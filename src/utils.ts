import type { Post } from "./data/site";

export function safeExternalUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

// public 中的资源使用相对路径，避免部署到 GitHub 仓库子目录时出现 404。
export function localAsset(path?: string): string | undefined {
  if (!path || /^(?:[a-z]+:|\/\/)/i.test(path) || path.includes(".."))
    return undefined;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export function filterPosts(posts: Post[], query: string): Post[] {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return posts.filter((post) => {
    const text = [
      post.title,
      post.category,
      post.summary,
      ...(post.paragraphs ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();
    return terms.every((term) => text.includes(term));
  });
}
