"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";
import { EASE_ENTRANCE } from "@/lib/motion";

/**
 * Approach page hero — back-link (mirrors CaseStudy's /#work pattern),
 * page title, and opening statement. Reveal timings match the case-study
 * header so the page feels part of the same family.
 */
export default function ApproachHero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanup = createRevealContext(rootRef, () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-hero-reveal]");
      gsap.from(items, {
        yPercent: 120,
        opacity: 0,
        rotateX: 25,
        transformPerspective: 1000,
        duration: 1,
        ease: EASE_ENTRANCE,
        stagger: 0.1,
      });
    });

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {/* Back link — same pattern as CaseStudy's ← Index */}
      <div data-hero-reveal className="relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-meta text-fg-muted transition-colors hover:text-fg-primary"
        >
          <span aria-hidden>←</span> Index
        </Link>
      </div>

      {/* Title + opening statement */}
      <header
        data-hero-reveal
        className="relative z-10 mt-12 border-b border-fg-primary/10 pb-12 md:mt-16 md:pb-16"
      >
        <p className="font-mono text-meta text-fg-muted">
          Approach
        </p>
        <h1 className="mt-4 font-display text-display text-fg-primary">
          How I work.
        </h1>
        <p className="mt-8 max-w-2xl font-display text-heading-sm leading-snug text-fg-muted md:text-heading-md">
          I build in phases, not all at once. Every project starts scoped tight,
          ships something working early, then gets pushed further — same way
          this site was built.
        </p>
      </header>
    </div>
  );
}
