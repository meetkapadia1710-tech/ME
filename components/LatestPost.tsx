"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";
import { EASE_ENTRANCE, DUR_STANDARD, REVEAL_Y_PCT } from "@/lib/motion";
import type { Post } from "@/lib/mdx";

export default function LatestPost({ post, ready }: { post: Post | null; ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready || !post) return;
    return createRevealContext(rootRef, () => {
      gsap.from(rootRef.current, {
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 85%",
          once: true,
        },
        yPercent: REVEAL_Y_PCT,
        opacity: 0,
        duration: DUR_STANDARD,
        ease: EASE_ENTRANCE,
      });
    });
  }, [ready, post]);

  if (!post) return null;

  return (
    <section ref={rootRef} className="px-6 py-6 md:px-10">
      <Link
        href={`/blog/${post.meta.slug}`}
        className="group flex flex-col justify-between rounded-2xl border border-fg-primary/10 bg-fg-primary/[0.02] p-6 md:p-8 transition-colors hover:border-fg-primary/20 hover:bg-fg-primary/[0.04] md:flex-row md:items-center"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 font-mono text-meta-sm uppercase tracking-widest text-fg-muted">
            <span className="flex items-center gap-1.5 text-fg-primary/60">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fg-primary/60 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fg-primary/80"></span>
              </span>
              Latest Post
            </span>
            <span>&bull;</span>
            <time dateTime={post.meta.date}>{post.meta.date}</time>
          </div>
          <h3 className="font-display text-heading-sm font-medium transition-colors group-hover:text-fg-primary/80 md:text-heading-md">
            {post.meta.title}
          </h3>
          <p className="font-mono text-body-sm text-fg-muted line-clamp-1 md:max-w-xl">
            {post.meta.excerpt}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 font-mono text-meta uppercase tracking-widest text-fg-muted transition-colors group-hover:text-fg-primary/60 md:mt-0">
          <span>Read</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </div>
      </Link>
    </section>
  );
}
