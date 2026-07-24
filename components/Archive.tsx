"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { createRevealContext, prefersReducedMotion } from "@/lib/reveal";
import { useRowTilt } from "@/hooks/useRowTilt";
import { ARCHIVE_STUDIES } from "@/lib/archiveData";
import {
  EASE_ENTRANCE, EASE_STANDARD,
  DUR_STANDARD,
  REVEAL_Y,
} from "@/lib/motion";

type FilterTag = "All" | "Personal" | "Team" | "Client" | "Hackathon" | "Systems";
const FILTERS: FilterTag[] = ["All", "Personal", "Team", "Client", "Hackathon", "Systems"];

export default function Archive() {
  const [activeFilter, setActiveFilter] = useState<FilterTag>("All");
  const listRef = useRef<HTMLUListElement>(null);

  const {
    rootRef,
    previewRef,
    cardsRef,
    rowEls,
    handleMove,
    showPreview,
    hidePreview,
  } = useRowTilt<HTMLDivElement>({ ready: true });

  useEffect(() => {
    return createRevealContext(rootRef, () => {
      // Floating preview — starts hidden, follows cursor via quickTo lerp.
      if (previewRef.current) {
        gsap.set(previewRef.current, {
          autoAlpha: 0,
          scale: 0.85,
          xPercent: -50,
          yPercent: -50,
        });
      }

      const items = gsap.utils.toArray<HTMLElement>("[data-reveal-row]");
      gsap.from(items, {
        y: REVEAL_Y,
        opacity: 0,
        duration: DUR_STANDARD,
        ease: EASE_ENTRANCE,
        stagger: 0.05,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 85%",
          once: true,
        },
      });
    });
  }, [rootRef, previewRef]);

  // Animate filter change — fade items out, reflow, fade matching back in
  const applyFilter = useCallback((tag: FilterTag) => {
    setActiveFilter(tag);
    if (prefersReducedMotion() || !listRef.current) return;

    const rows = listRef.current.querySelectorAll<HTMLElement>("[data-archive-row]");
    rows.forEach((row) => {
      const role = row.dataset.role ?? "";
      const visible = tag === "All" || role === tag;
      gsap.to(row, {
        opacity: visible ? 1 : 0.08,
        y: visible ? 0 : 6,
        duration: 0.35,
        ease: EASE_STANDARD,
        pointerEvents: visible ? "auto" : "none",
      });
    });
  }, []);

  return (
    <div ref={rootRef} onMouseMove={handleMove} className="relative bg-background px-6 pt-28 pb-24 md:px-10 md:pt-32 md:pb-32">
      {/* Header */}
      <div data-reveal-row>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-meta text-fg-muted transition-colors hover:text-fg-primary"
        >
          <span aria-hidden>←</span> Index
        </Link>
      </div>

      <header data-reveal-row className="mt-12 border-b border-fg-primary/10 pb-12 md:mt-16 md:pb-16">
        <h1 className="font-display text-display text-fg-primary">
          Archive.
        </h1>
        <p className="mt-6 max-w-2xl font-display text-heading-sm leading-snug text-fg-muted md:text-heading-md">
          Everything else I&apos;ve built.
        </p>
      </header>

      {/* Filter Pills */}
      <div data-reveal-row className="mt-10 flex flex-wrap gap-2 md:mt-12">
        {FILTERS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => applyFilter(tag)}
            className={`rounded-full border px-4 py-1.5 font-mono text-meta transition-all duration-200 ${
              activeFilter === tag
                ? "border-fg-primary/60 bg-fg-primary/10 text-fg-primary"
                : "border-fg-primary/15 text-fg-muted hover:border-fg-primary/30 hover:text-fg-primary/70"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Flat List */}
      <ul ref={listRef} className="group/list mt-6 md:mt-8 [perspective:1000px]">
        {ARCHIVE_STUDIES.map((p, i) => (
          <li key={p.slug} data-reveal-row data-archive-row data-role={p.role} className="transition-all duration-500 ease-out group-has-[a:hover]/list:scale-[0.98] group-has-[a:hover]/list:opacity-40 group-has-[a:hover]/list:blur-[1px]">
            <Link
              ref={(el) => { rowEls.current[i] = el; }}
              href={`/archive/${p.slug}`}
              onMouseEnter={() => showPreview(i)}
              onMouseLeave={() => hidePreview(i)}
              onBlur={() => hidePreview(i)}
              className="group flex flex-col gap-3 rounded-2xl p-4 transition-all duration-500 ease-out hover:!scale-[1.01] hover:!opacity-100 hover:!blur-none hover:bg-fg-primary/[0.02] hover:shadow-2xl focus:!opacity-100 focus-visible:outline-none md:flex-row md:items-start md:gap-8 md:p-6"
            >
              <div className="md:w-1/4">
                <span className="font-mono text-meta text-fg-muted">
                  {p.role}
                </span>
                <h3 className="mt-1 font-display text-heading-md tracking-tight text-fg-primary transition-transform duration-300 group-hover:translate-x-2">
                  {p.name}
                </h3>
              </div>

              <div className="flex flex-col items-start justify-between gap-4 md:w-3/4 md:flex-row md:items-center">
                <p className="font-mono text-body-sm leading-relaxed text-fg-muted transition-colors group-hover:text-fg-primary/80 md:max-w-xl">
                  {p.overview}
                </p>

                <div className="flex items-center gap-4">
                  {p.liveUrl && (
                    <object>
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-2 font-mono text-meta text-blue-400 transition-colors hover:text-blue-300 relative z-10"
                      >
                        Live Demo
                        <span aria-hidden className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                          →
                        </span>
                      </a>
                    </object>
                  )}
                  <span className="inline-flex shrink-0 items-center gap-2 font-mono text-meta text-fg-muted transition-colors group-hover:text-fg-primary">
                    View{" "}
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* ── Desktop cursor-follow floating preview (fine-pointer only) ── */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[320px] w-[260px] overflow-hidden rounded-xl bg-[#0a0a0a] md:block border border-fg-primary/10"
        style={{ willChange: "transform" }}
      >
        {/* CSS Grid Overlay */}
        <div
          className="absolute inset-0 z-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '2rem 2rem',
            backgroundPosition: 'center center'
          }}
        ></div>

        {ARCHIVE_STUDIES.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center opacity-0"
          >
            {p.images?.hero ? (
              <Image src={p.images.hero} alt={p.name} fill className="object-cover object-center bg-[#0a0a0a]" sizes="260px" />
            ) : (
              <span className="px-6 text-center font-display text-heading-md tracking-tight text-fg-primary/90">
                {p.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
