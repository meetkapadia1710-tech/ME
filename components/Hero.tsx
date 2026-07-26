"use client";

import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/reveal";
import { CURRENTLY_BUILDING } from "@/lib/currentBuild";
import {
  EASE_ENTRANCE, DUR_SLOW, STAGGER_LOOSE,
  REVEAL_Y_PCT, REVEAL_ROTATE_X, REVEAL_PERSPECTIVE,
} from "@/lib/motion";
import { useWebGLStore } from "@/lib/store";
import { TextScrollReveal } from "@/components/ui/text-scroll-reveal";

const MARQUEE_PHRASE = "Full-Stack Developer — SDE — ";

export default function Hero({ loaded }: { loaded: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const setIntensity = useWebGLStore((s) => s.setIntensity);

  useEffect(() => {
    setIntensity(1.0);
    return () => setIntensity(0);
  }, [setIntensity]);

  // Infinite marquee
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
        if (reduced) return;
        tweenRef.current = gsap.to(track, {
          xPercent: -50,
          repeat: -1,
          ease: "none",
          duration: isMobile ? 32 : 22,
        });
      },
    );

    return () => {
      mm.revert();
      tweenRef.current?.kill();
    };
  }, []);

  // Entrance reveal, gated on the preloader finishing.
  useEffect(() => {
    if (!loaded || !revealRef.current) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      gsap.from(targets, {
        yPercent: REVEAL_Y_PCT,
        opacity: 0,
        rotateX: REVEAL_ROTATE_X,
        transformPerspective: REVEAL_PERSPECTIVE,
        duration: DUR_SLOW,
        ease: EASE_ENTRANCE,
        stagger: STAGGER_LOOSE,
        delay: 0.1,
      });
    }, revealRef);

    return () => ctx.revert();
  }, [loaded]);

  return (
    <section id="hero" className="relative flex min-h-svh flex-col justify-between overflow-hidden pt-28 md:pt-32">
      {/*
        The marquee is split into one <span> per character for the hover
        animation, so it carries no heading semantics — the homepage had no
        <h1> at all, which costs both search ranking and the a11y document
        outline. This provides the real heading; the marquee is decorative.
      */}
      <h1 className="sr-only">Meet Kapadia — Full-Stack Developer and SDE</h1>

      {/* Marquee */}
      <div
        className="relative z-10 flex select-none py-10 cursor-default [perspective:1000px]"
        aria-hidden
      >
        <div
          className="flex w-full [transform:rotateX(10deg)_rotateZ(-2deg)]"
          onMouseEnter={() => tweenRef.current?.pause()}
          onMouseLeave={() => tweenRef.current?.play()}
        >
          <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
            {[0, 1].map((i) => (
              <div key={i} aria-hidden={i === 1} className="whitespace-nowrap">
                {MARQUEE_PHRASE.repeat(3)
                  .split("")
                  .map((char, index) => (
                    <span
                      key={index}
                      className="inline-block font-display text-[12vw] font-medium uppercase leading-[0.9] tracking-tighter text-fg-primary md:text-[13vw] transition-[transform,text-shadow,font-family] duration-200 ease-out hover:font-mono hover:-translate-y-3 hover:scale-110 hover:-rotate-3 hover:[text-shadow:1px_1px_0_#333,3px_3px_0_#333,5px_5px_0_#222,7px_7px_0_#222,9px_9px_0_#111]"
                      style={{ whiteSpace: "pre" }}
                    >
                      {char}
                    </span>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower content */}
      <div
        ref={revealRef}
        className="relative z-10 flex flex-col gap-10 px-6 pb-12 md:flex-row md:items-end md:justify-between md:px-10 md:pb-14"
      >
        <div className="max-w-md overflow-hidden">
          <TextScrollReveal 
            text="I design and ship full products end to end — from the data model to the last pixel of motion."
            className="font-display text-heading-sm leading-snug text-fg-primary md:text-heading-md"
          />
        </div>

        <div className="flex flex-col gap-5 md:items-end">
          <div className="overflow-hidden">
            <span
              data-reveal
              className="inline-flex items-center gap-2.5 rounded-full border border-fg-primary/20 px-4 py-2 font-mono text-meta text-fg-primary"
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
              className="font-mono text-meta text-fg-muted"
            >
              Based in Gujarat, India
            </p>
          </div>

          <div className="overflow-hidden">
            <p
              data-reveal
              className="font-mono text-meta text-fg-muted"
            >
              Building — {CURRENTLY_BUILDING}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
