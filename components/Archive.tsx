"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { createRevealContext, prefersReducedMotion } from "@/lib/reveal";
import { ARCHIVE_STUDIES } from "@/lib/archiveData";

export default function Archive() {
  const rootRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const canHover = useRef(false);
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
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

      const items = gsap.utils.toArray<HTMLElement>("[data-reveal-row]");
      gsap.from(items, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 85%",
          once: true,
        },
      });
    });
  }, []);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!canHover.current) return;
    xTo.current?.(e.clientX);
    yTo.current?.(e.clientY);
  }, []);

  const showPreview = useCallback((i: number) => {
    if (!canHover.current || !previewRef.current) return;
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

  return (
    <div ref={rootRef} onMouseMove={handleMove} className="relative px-6 pt-28 pb-24 md:px-10 md:pt-32 md:pb-32">
      {/* Header */}
      <div data-reveal-row>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-foreground/60 transition-colors hover:text-foreground"
        >
          <span aria-hidden>←</span> Index
        </Link>
      </div>

      <header data-reveal-row className="mt-12 border-b border-foreground/10 pb-12 md:mt-16 md:pb-16">
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-foreground md:text-8xl">
          Archive.
        </h1>
        <p className="mt-6 max-w-2xl font-display text-xl leading-snug text-foreground/70 md:text-2xl">
          Everything else I&apos;ve built.
        </p>
      </header>

      {/* Flat List */}
      <ul className="group/list mt-12 md:mt-16">
        {ARCHIVE_STUDIES.map((p, i) => (
          <li key={p.slug} data-reveal-row>
            <Link
              href={`/archive/${p.slug}`}
              onMouseEnter={() => showPreview(i)}
              onMouseLeave={hidePreview}
              className="group flex flex-col gap-3 border-b border-foreground/10 py-6 opacity-100 transition-opacity duration-300 first:border-t hover:!opacity-100 group-hover/list:opacity-40 md:flex-row md:items-start md:gap-8 md:py-8"
            >
              <div className="md:w-1/4">
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/50">
                  {p.role}
                </span>
                <h3 className="mt-1 font-display text-2xl tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-2">
                  {p.name}
                </h3>
              </div>

              <div className="flex flex-col items-start justify-between gap-4 md:w-3/4 md:flex-row md:items-center">
                <p className="font-mono text-sm leading-relaxed text-foreground/60 transition-colors group-hover:text-foreground/80 md:max-w-xl">
                  {p.overview}
                </p>

                <span className="inline-flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-foreground/40 transition-colors group-hover:text-foreground">
                  View{" "}
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* ── Desktop cursor-follow floating preview (fine-pointer only) ── */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[320px] w-[260px] overflow-hidden rounded-xl bg-[#0a0a0a] md:block border border-foreground/10"
        style={{ willChange: "transform" }}
      >
        {/* CSS Grid Overlay (replicates the AI-generated placeholder look) */}
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
              <img src={p.images.hero} alt={p.name} className="absolute inset-0 w-full h-full object-cover object-center bg-[#0a0a0a]" />
            ) : (
              <span className="px-6 text-center font-display text-2xl tracking-tight text-foreground/90">
                {p.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
