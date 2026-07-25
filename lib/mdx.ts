import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";

const postsDirectory = path.resolve(process.cwd(), "content/posts");

export interface PostMeta {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  slug: string;
  readingTime: string;
}

export interface Post {
  meta: PostMeta;
  content: string;
}

function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/g);
  const noOfWords = words.filter(Boolean).length;
  const minutes = noOfWords / wordsPerMinute;
  const readTime = Math.ceil(minutes) || 1;
  return `${readTime} min read`;
}

export const getPostSlugs = cache((): string[] => {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
});

export const getPostBySlug = cache((slug: string): Post => {
  const sanitizedSlug = path.basename(slug).replace(/\.mdx$/, "");
  const fullPath = path.join(postsDirectory, `${sanitizedSlug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`MDX post not found: ${sanitizedSlug}`);
  }

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const readingTime = calculateReadingTime(content);

    return {
      meta: {
        title: data.title || "Untitled",
        date: data.date ? String(data.date) : new Date().toISOString(),
        excerpt: data.excerpt || "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        slug: sanitizedSlug,
        readingTime,
      },
      content,
    };
  } catch (error) {
    console.error(`Failed to parse MDX post at ${fullPath}:`, error);
    throw new Error(`Invalid MDX frontmatter or content in ${sanitizedSlug}`);
  }
});

export const getAllPosts = cache((): Post[] => {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => {
      try {
        return getPostBySlug(slug);
      } catch (err) {
        console.error(`Error loading post ${slug}:`, err);
        return null;
      }
    })
    .filter((post): post is Post => post !== null)
    .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1));

  return posts;
});
