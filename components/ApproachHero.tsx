"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";
import { EASE_ENTRANCE } from "@/lib/motion";
import WebGLTechSphere from "./WebGLTechSphere";

/**
 * Approach page hero — back-link (mirrors CaseStudy's /#work pattern),
 * page title, and opening statement. Reveal timings match the case-study
 * header so the page feels part of the same family.
 */
export default function ApproachHero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return createRevealContext(rootRef, () => {
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
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <WebGLTechSphere />
      {/* Back link — same pattern as CaseStudy's ← Index */}
      <div data-hero-reveal className="relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-foreground/60 transition-colors hover:text-foreground"
        >
          <span aria-hidden>←</span> Index
        </Link>
      </div>

      {/* Title + opening statement */}
      <header
        data-hero-reveal
        className="relative z-10 mt-12 border-b border-foreground/10 pb-12 md:mt-16 md:pb-16"
      >
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-foreground/50">
          Approach
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight text-foreground md:text-8xl">
          How I work.
        </h1>
        <p className="mt-8 max-w-2xl font-display text-xl leading-snug text-foreground/70 md:text-2xl">
          I build in phases, not all at once. Every project starts scoped tight,
          ships something working early, then gets pushed further — same way
          this site was built.
        </p>
      </header>
    </div>
  );
}
