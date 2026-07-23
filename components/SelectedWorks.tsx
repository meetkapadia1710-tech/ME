"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { createRevealContext, prefersReducedMotion } from "@/lib/reveal";

type Work = {
  num: string;
  slug: string;
  name: string;
  brief: string;
  year: string;
  tags: string[];
  thumbnail: string;
};

// NOTE: `year` values are PLACEHOLDERS — confirm/replace with the real ship year.
const WORKS: Work[] = [
  {
    num: "01",
    slug: "playhub",
    name: "PlayHub",
    brief:
      "Cross-platform turf booking app for cricket and pickleball courts, with real-time booking, Razorpay payments, and role-based dashboards for players, owners, and admins.",
    year: "2025",
    tags: ["Mobile Development", "Full-Stack"],
    thumbnail: "/work/playhub/thumbnail.jpg",
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
  },
];

export default function SelectedWorks({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  // One ref slot per card so we can fade the active one in/out individually.
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const canHover = useRef(false);
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  // Mobile: track which row is expanded to show its inline thumbnail.
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!ready) return;

    canHover.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !prefersReducedMotion();

    return createRevealContext(rootRef, () => {
      // Floating preview — starts hidden, follows cursor via quickTo lerp.
      if (previewRef.current) {
        gsap.set(previewRef.current, {
          autoAlpha: 0,
          scale: 0.85,
          xPercent: -50,
          yPercent: -50,
        });
        xTo.current = gsap.quickTo(previewRef.current, "x", {
          duration: 0.55,
          ease: "power3",
        });
        yTo.current = gsap.quickTo(previewRef.current, "y", {
          duration: 0.55,
          ease: "power3",
        });
      }

      // Scroll-in reveal — same timing as Intro / Core Tools.
      const heading = gsap.utils.toArray<HTMLElement>("[data-reveal-heading]");
      const rows = gsap.utils.toArray<HTMLElement>("[data-reveal-row]");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          once: true,
        },
      });
      tl.from(heading, {
        yPercent: 110,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      }).from(
        rows,
        {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
        },
        "-=0.5",
      );
    });
  }, [ready]);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!canHover.current) return;
    xTo.current?.(e.clientX);
    yTo.current?.(e.clientY);
  }, []);

  const showPreview = useCallback((i: number) => {
    if (!canHover.current || !previewRef.current) return;
    // Fade the whole floating panel in, then cross-fade to the right card.
    gsap.to(previewRef.current, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.4,
      ease: "power3.out",
    });
    cardsRef.current.forEach((card, idx) => {
      if (card) {
        gsap.to(card, {
          opacity: idx === i ? 1 : 0,
          duration: 0.25,
          ease: "power2.out",
        });
      }
    });
  }, []);

  const hidePreview = useCallback(() => {
    if (!previewRef.current) return;
    gsap.to(previewRef.current, {
      autoAlpha: 0,
      scale: 0.85,
      duration: 0.3,
      ease: "power3.out",
    });
  }, []);

  // Mobile: first tap expands inline thumbnail; second tap lets Link navigate.
  const handleRowTap = useCallback(
    (e: React.MouseEvent, i: number) => {
      if (canHover.current) return; // desktop: Link navigates normally
      if (expandedIndex === i) return; // already expanded — navigate
      e.preventDefault();
      setExpandedIndex((prev) => (prev === i ? null : i));
    },
    [expandedIndex],
  );

  return (
    <section
      id="work"
      ref={rootRef}
      onMouseMove={handleMove}
      className="relative scroll-mt-24 border-t border-foreground/10 px-6 py-24 md:px-10 md:py-32"
    >
      {/* Section heading */}
      <div className="mb-12 overflow-hidden md:mb-16">
        <span
          data-reveal-heading
          className="inline-block font-mono text-xs uppercase tracking-[0.15em] text-foreground/50"
        >
          Selected Works
        </span>
      </div>

      {/* Numbered list */}
      <ul className="group/list">
        {WORKS.map((work, i) => (
          <li key={work.slug} data-reveal-row>
            <Link
              href={`/work/${work.slug}`}
              onClick={(e) => handleRowTap(e, i)}
              onMouseEnter={() => showPreview(i)}
              onMouseLeave={hidePreview}
              className="group block border-t border-foreground/10 py-8 opacity-100 transition-opacity duration-300 last:border-b last:border-foreground/10 hover:!opacity-100 group-hover/list:opacity-40 md:py-10"
            >
              {/* Top line: number + name + CTA */}
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-baseline gap-4 md:gap-6">
                  <span className="font-mono text-xs tabular-nums text-foreground/40">
                    {work.num} / 03
                  </span>
                  <h3 className="font-display text-4xl leading-none tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-2 md:text-7xl">
                    {work.name}
                  </h3>
                </div>
                <span className="mt-1 hidden shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-foreground/60 transition-colors group-hover:text-foreground md:inline-flex">
                  View Case Study
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
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
                <p className="max-w-xl font-mono text-sm leading-relaxed text-foreground/55">
                  {work.brief}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/45">
                  <span className="tabular-nums text-foreground/60">
                    {work.year}
                  </span>
                  <span aria-hidden className="text-foreground/25">
                    /
                  </span>
                  {work.tags.map((tag, t) => (
                    <span key={tag} className="flex items-center gap-3">
                      {t > 0 && (
                        <span aria-hidden className="text-foreground/25">
                          ·
                        </span>
                      )}
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mobile CTA */}
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-foreground/60 md:hidden">
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
          className="group inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.15em] text-foreground/60 transition-colors hover:text-foreground"
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
              className="object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
