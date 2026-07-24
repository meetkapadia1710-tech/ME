"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";
import { EASE_ENTRANCE, REVEAL_Y_PCT, DUR_STANDARD } from "@/lib/motion";
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
            className="font-display text-heading-md font-medium tracking-tight md:text-heading-lg"
          >
            Writing
          </h1>
        </div>
      </div>

      <div className="flex flex-col border-t border-fg-primary/10">
        {posts.map((post) => (
          <div key={post.meta.slug} className="overflow-hidden">
            <Link
              href={`/blog/${post.meta.slug}`}
              data-blog-row
              className="group flex flex-col justify-between border-b border-fg-primary/10 py-6 transition-colors hover:bg-fg-primary/[0.02] md:flex-row md:items-center md:py-8"
            >
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-heading-sm md:text-heading-md font-medium transition-colors group-hover:text-fg-primary/80">
                  {post.meta.title}
                </h2>
                <p className="font-mono text-body-sm text-fg-muted md:max-w-xl">
                  {post.meta.excerpt}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.meta.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-fg-primary/5 px-2 py-0.5 font-mono text-meta-sm uppercase tracking-wider text-fg-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between font-mono text-meta text-fg-muted md:mt-0 md:flex-col md:items-end md:gap-1">
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
