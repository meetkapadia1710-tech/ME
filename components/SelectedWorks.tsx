"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";
import { useRowTilt } from "@/hooks/useRowTilt";
import {
  EASE_ENTRANCE,
  DUR_STANDARD,
  REVEAL_Y, REVEAL_Y_PCT, REVEAL_ROTATE_X, REVEAL_PERSPECTIVE,
} from "@/lib/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Work = {
  num: string;
  slug: string;
  name: string;
  brief: string;
  year: string;
  tags: string[];
  thumbnail: string;
  playgroundType?: "none" | "iframe" | "interactive" | "video";
  skillCategories?: string[];
};

// NOTE: `year` values are PLACEHOLDERS — confirm/replace with the real ship year.
export const WORKS: Work[] = [

  {
    num: "01",
    slug: "playhub",
    name: "PlayHub",
    brief:
      "Cross-platform turf booking app for cricket and pickleball courts, with real-time booking, Razorpay payments, and role-based dashboards for players, owners, and admins.",
    year: "2025",
    tags: ["Mobile Development", "Full-Stack"],
    thumbnail: "/work/playhub/thumbnail.jpg",
    playgroundType: "interactive",
    skillCategories: ["Frontend", "Mobile", "Backend"],
  },
  {
    num: "02",
    slug: "locateme-family",
    name: "LocateMe Family",
    brief:
      "Consent-first family location-sharing app, built for trust rather than surveillance.",
    year: "2025",
    tags: ["Mobile Development", "Android"],
    thumbnail: "/work/locateme-family/thumbnail.jpg",
    playgroundType: "interactive",
    skillCategories: ["Mobile", "Systems"],
  },
  {
    num: "03",
    slug: "repograde",
    name: "RepoGrade",
    brief:
      "GitHub tool that scores repositories and auto-generates READMEs grounded in the actual code.",
    year: "2025",
    tags: ["Developer Tools", "Full-Stack", "AI"],
    thumbnail: "/work/repograde/thumbnail.jpg",
    playgroundType: "interactive",
    skillCategories: ["Frontend", "Backend", "Systems", "AI/Tooling"],
  },
];

export default function SelectedWorks({ ready }: { ready: boolean }) {

  const {
    rootRef,
    previewRef,
    cardsRef,
    rowEls,
    handleMove,
    showPreview,
    hidePreview,
    canHover,
  } = useRowTilt({ ready });

  // Mobile: track which row is expanded to show its inline thumbnail.
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!ready) return;

    return createRevealContext(rootRef, () => {

      // Scroll-in reveal — scoped to this section only.
      const heading = rootRef.current?.querySelectorAll<HTMLElement>("[data-reveal-heading]");
      const rows = rootRef.current?.querySelectorAll<HTMLElement>("[data-reveal-row]");

      if (heading && heading.length > 0) {
        gsap.from(Array.from(heading), {
          yPercent: REVEAL_Y_PCT,
          opacity: 0,
          rotateX: REVEAL_ROTATE_X,
          transformPerspective: REVEAL_PERSPECTIVE,
          duration: DUR_STANDARD + 0.25,
          ease: EASE_ENTRANCE,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 75%",
            once: true,
          },
        });
      }

      if (rows && rows.length > 0) {
        // Only animate y/rotateX — no opacity, so items are always visible.
        // This prevents any CSS transition conflict from making items invisible.
        gsap.from(Array.from(rows), {
          y: REVEAL_Y,
          rotateX: -10,
          transformPerspective: REVEAL_PERSPECTIVE,
          duration: DUR_STANDARD,
          ease: EASE_ENTRANCE,
          stagger: 0.08,
          clearProps: "transform",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 75%",
            once: true,
          },
        });
      }

    });
  }, [ready, rootRef]);

  // Mobile: first tap expands inline thumbnail; second tap lets Link navigate.
  const handleRowTap = useCallback(
    (e: React.MouseEvent, i: number) => {
      if (canHover.current) return; // desktop: Link navigates normally
      if (expandedIndex === i) return; // already expanded — navigate
      e.preventDefault();
      setExpandedIndex((prev) => (prev === i ? null : i));
    },
    [expandedIndex, canHover],
  );

  return (
    <section
      id="work"
      ref={rootRef}
      onMouseMove={handleMove}
      className="relative scroll-mt-24 divider-top bg-background px-6 py-32 md:px-10 md:py-48"
    >
      <SectionHeading label="Selected Works" />

      {/* Numbered list */}
      <ul className="group/list [perspective:1000px]">
        {WORKS.map((work, i) => (
          <li key={work.slug} data-reveal-row className="group-has-[a:hover]/list:[&:not(:hover)]:opacity-40 group-has-[a:hover]/list:[&:not(:hover)]:scale-[0.97] transition-[opacity,transform] duration-500 ease-out">
            <Link
              ref={(el) => { rowEls.current[i] = el; }}
              href={`/work/${work.slug}`}
              data-shader-hover
              onClick={(e) => handleRowTap(e, i)}
              onMouseEnter={() => showPreview(i)}
              onMouseLeave={() => hidePreview(i)}
              onBlur={() => hidePreview(i)}
              className="group flex flex-col gap-3 rounded-2xl p-6 transition-all duration-500 ease-out hover:!scale-[1.02] hover:!opacity-100 hover:!blur-none hover:bg-fg-primary/[0.02] hover:shadow-2xl focus:!opacity-100 focus-visible:outline-none md:flex-row md:items-center md:justify-between md:gap-8 md:p-8"
            >
              {/* Top line: number + name + CTA */}
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-baseline gap-4 md:gap-6">
                  <span className="font-mono text-meta tabular-nums text-fg-muted">
                    {work.num} / 03
                  </span>
                  <h3 className="font-display text-heading-md leading-none tracking-tight text-fg-primary transition-transform duration-300 group-hover:translate-x-2 md:text-heading-lg">
                    {work.name}
                  </h3>
                </div>
                <span className="mt-1 hidden shrink-0 items-center gap-2 font-mono text-meta uppercase tracking-[0.15em] text-fg-muted transition-colors group-hover:text-fg-primary md:inline-flex">
                  View Case Study
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
                {work.playgroundType && work.playgroundType !== "none" && (
                  <span className="hidden shrink-0 items-center gap-1 rounded-full border border-fg-primary/20 bg-surface px-2 py-0.5 font-mono text-meta-sm uppercase tracking-widest text-fg-primary transition-colors group-hover:border-fg-primary/40 group-hover:bg-fg-primary/10 md:inline-flex mt-1">
                    Try It
                  </span>
                )}
              </div>

              {/* Mobile inline thumbnail — shown on first tap */}
              {expandedIndex === i && (
                <div className="mt-5 overflow-hidden rounded-sm md:hidden">
                  <Image
                    src={work.thumbnail}
                    alt={`${work.name} preview`}
                    width={640}
                    height={853}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Bottom line: brief + meta */}
              <div className="mt-4 flex flex-col gap-3 md:mt-5 md:flex-row md:items-end md:justify-between md:gap-8">
                <p className="max-w-xl font-mono text-body-sm leading-relaxed text-fg-muted">
                  {work.brief}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-meta uppercase tracking-[0.15em] text-fg-muted">
                  <span className="tabular-nums">
                    {work.year}
                  </span>
                  <span aria-hidden className="opacity-50">
                    /
                  </span>
                  {work.tags.map((tag, t) => (
                    <span key={tag} className="flex items-center gap-3">
                      {t > 0 && (
                        <span aria-hidden className="opacity-50">
                          ·
                        </span>
                      )}
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mobile CTA */}
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-meta uppercase tracking-[0.15em] text-fg-muted md:hidden">
                {expandedIndex === i ? (
                  <>View Case Study <span aria-hidden>→</span></>
                ) : (
                  <>Preview <span aria-hidden>↓</span></>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* View all projects link */}
      <div data-reveal-row className="mt-12 flex justify-start md:mt-16">
        <Link
          href="/archive"
          data-shader-hover
          className="group inline-flex items-center gap-3 font-mono text-body-sm uppercase tracking-[0.15em] text-fg-muted transition-colors hover:text-fg-primary"
        >
          View all projects
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>

      {/* ── Desktop cursor-follow floating preview (fine-pointer only) ──
          Fixed, pointer-events-none. One Image per project layered in the
          same container; GSAP fades each card independently in showPreview. */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[320px] w-[260px] overflow-hidden rounded-xl md:block"
        style={{ willChange: "transform" }}
      >
        {WORKS.map((work, i) => (
          <div
            key={work.slug}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="absolute inset-0 opacity-0"
          >
            <Image
              src={work.thumbnail}
              alt=""
              fill
              sizes="260px"
              className="object-cover grayscale-[50%] hover:grayscale-0 transition-all duration-700"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
