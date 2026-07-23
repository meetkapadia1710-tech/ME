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
        className="group flex flex-col justify-between rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 md:p-8 transition-colors hover:border-foreground/20 hover:bg-foreground/[0.04] md:flex-row md:items-center"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
            <span className="flex items-center gap-1.5 text-foreground/60">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/60 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground/80"></span>
              </span>
              Latest Post
            </span>
            <span>&bull;</span>
            <time dateTime={post.meta.date}>{post.meta.date}</time>
          </div>
          <h3 className="font-display text-xl font-medium transition-colors group-hover:text-foreground/80 md:text-2xl">
            {post.meta.title}
          </h3>
          <p className="text-sm text-foreground/60 line-clamp-1 md:max-w-xl">
            {post.meta.excerpt}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground/40 transition-colors group-hover:text-foreground/60 md:mt-0">
          <span>Read</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </div>
      </Link>
    </section>
  );
}
