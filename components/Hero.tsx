"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/reveal";
import { CURRENTLY_BUILDING } from "@/lib/currentBuild";
import {
  EASE_ENTRANCE, DUR_SLOW, STAGGER_LOOSE,
  REVEAL_Y_PCT, REVEAL_ROTATE_X, REVEAL_PERSPECTIVE,
} from "@/lib/motion";

/** Slow camera drift — only runs inside the Hero canvas */
function DriftCamera() {
  useFrame((state, delta) => {
    if (prefersReducedMotion()) return;
    state.camera.rotation.z += delta * 0.018;
    // Subtle mouse parallax
    state.camera.rotation.x += (state.pointer.y * 0.04 - state.camera.rotation.x) * 0.03;
    state.camera.rotation.y += (state.pointer.x * 0.04 - state.camera.rotation.y) * 0.03;
  });
  return null;
}

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
  const tweenRef = useRef<gsap.core.Tween | null>(null);

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
    if (prefersReducedMotion()) return; // content is visible by default

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
    <section className="relative flex min-h-svh flex-col justify-between overflow-hidden pt-28 md:pt-32">
      {/* ── Scoped WebGL starfield — only covers the Hero section ── */}
      {!prefersReducedMotion() && (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ alpha: true, antialias: false }}>
            <Stars radius={20} depth={60} count={2500} factor={4} saturation={0} fade speed={1} />
            <DriftCamera />
          </Canvas>
        </div>
      )}
      <div
        className="relative z-10 flex select-none overflow-hidden py-10 cursor-default"
        aria-label="Full-Stack Developer, SDE"
      >
        <div 
          className="flex w-full"
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
                      className="inline-block font-display text-[12vw] font-medium uppercase leading-[0.9] tracking-tighter text-foreground md:text-[13vw] transition-[transform,text-shadow,font-family] duration-200 ease-out hover:font-mono hover:-translate-y-3 hover:scale-110 hover:-rotate-3 hover:[text-shadow:1px_1px_0_#333,3px_3px_0_#333,5px_5px_0_#222,7px_7px_0_#222,9px_9px_0_#111]"
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

          <div className="overflow-hidden">
            <p
              data-reveal
              className="font-mono text-xs uppercase tracking-[0.12em] text-foreground/35"
            >
              Building — {CURRENTLY_BUILDING}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
