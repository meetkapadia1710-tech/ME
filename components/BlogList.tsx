"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";
import { EASE_ENTRANCE, DUR_STANDARD, DUR_FAST, REVEAL_Y_PCT } from "@/lib/motion";
import type { Post } from "@/lib/mdx";

export default function BlogList({ posts }: { posts: Post[] }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    return createRevealContext(rootRef, () => {
      const tl = gsap.timeline();
      
      tl.from("[data-blog-heading]", {
        yPercent: REVEAL_Y_PCT,
        opacity: 0,
        duration: DUR_STANDARD,
        ease: EASE_ENTRANCE,
      });

      tl.from(
        "[data-blog-row]",
        {
          yPercent: REVEAL_Y_PCT,
          opacity: 0,
          duration: DUR_STANDARD,
          ease: EASE_ENTRANCE,
          stagger: 0.08,
        },
        "-=0.5",
      );
    });
  }, []);

  return (
    <section ref={rootRef} className="px-6 pb-24 pt-32 md:px-10 md:pt-40">
      <div className="mb-16 md:mb-24">
        <div className="overflow-hidden">
          <h1
            data-blog-heading
            className="font-display text-4xl font-medium tracking-tight md:text-5xl"
          >
            Writing
          </h1>
        </div>
      </div>

      <div className="flex flex-col border-t border-foreground/10">
        {posts.map((post) => (
          <div key={post.meta.slug} className="overflow-hidden">
            <Link
              href={`/blog/${post.meta.slug}`}
              data-blog-row
              className="group flex flex-col justify-between border-b border-foreground/10 py-6 transition-colors hover:bg-foreground/[0.02] md:flex-row md:items-center md:py-8"
            >
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-xl md:text-2xl font-medium transition-colors group-hover:text-foreground/80">
                  {post.meta.title}
                </h2>
                <p className="text-sm text-foreground/60 md:max-w-xl">
                  {post.meta.excerpt}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.meta.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-foreground/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-foreground/40 md:mt-0 md:flex-col md:items-end md:gap-1">
                <span>{post.meta.date}</span>
                <span>{post.meta.readingTime}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
