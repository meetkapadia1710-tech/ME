"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/reveal";

const MARQUEE_PHRASE = "Full-Stack Developer — SDE — ";

/**
 * Hero section.
 * - Infinite horizontal marquee driven by a GSAP timeline (not CSS keyframes)
 *   so it can be hooked to scroll-scrub in a later phase.
 * - Entrance reveal (based-in line, badge, pitch) plays once `loaded` is true,
 *   i.e. after the preloader has slid away.
 */
export default function Hero({ loaded }: { loaded: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Infinite marquee — runs independently of the preloader.
  // gsap.matchMedia handles both responsive speed and reduced motion: slower
  // loop on phones, and no loop at all (static text) when motion is reduced.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { isMobile, reduced } = ctx.conditions as {
          isMobile: boolean;
          isDesktop: boolean;
          reduced: boolean;
        };
        if (reduced) return; // static text — no infinite loop
        // Two identical copies live in the track; shifting by -50% loops seamlessly.
        gsap.to(track, {
          xPercent: -50,
          repeat: -1,
          ease: "none",
          duration: isMobile ? 32 : 22,
        });
      },
    );

    return () => mm.revert();
  }, []);

  // Entrance reveal, gated on the preloader finishing.
  useEffect(() => {
    if (!loaded || !revealRef.current) return;
    if (prefersReducedMotion()) return; // content is visible by default

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      gsap.from(targets, {
        yPercent: 120,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.1,
      });
    }, revealRef);

    return () => ctx.revert();
  }, [loaded]);

  return (
    <section className="relative flex min-h-svh flex-col justify-between overflow-hidden pt-28 md:pt-32">
      {/* Marquee band */}
      <div
        className="flex select-none overflow-hidden"
        aria-label="Full-Stack Developer, SDE"
      >
        <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
          {[0, 1].map((i) => (
            <span
              key={i}
              aria-hidden={i === 1}
              className="font-display text-[12vw] font-medium uppercase leading-[0.9] tracking-tighter text-foreground md:text-[13vw]"
            >
              {MARQUEE_PHRASE.repeat(3)}
            </span>
          ))}
        </div>
      </div>

      {/* Lower content */}
      <div
        ref={revealRef}
        className="flex flex-col gap-10 px-6 pb-12 md:flex-row md:items-end md:justify-between md:px-10 md:pb-14"
      >
        <div className="max-w-md overflow-hidden">
          <p
            data-reveal
            className="font-display text-lg leading-snug text-foreground md:text-xl"
          >
            I design and ship full products end to end — from the data model to
            the last pixel of motion.
          </p>
        </div>

        <div className="flex flex-col gap-5 md:items-end">
          <div className="overflow-hidden">
            <span
              data-reveal
              className="inline-flex items-center gap-2.5 rounded-full border border-foreground/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/80"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Available for SDE / full-stack internships
            </span>
          </div>

          <div className="overflow-hidden">
            <p
              data-reveal
              className="font-mono text-xs uppercase tracking-[0.15em] text-foreground/50"
            >
              Based in Gujarat, India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
