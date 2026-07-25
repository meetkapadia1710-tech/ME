"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/reveal";

/**
 * Full-screen black overlay with an animated 0 -> 100 counter (GSAP).
 * On completion it slides away, unlocks scroll, and fires `onComplete`
 * so the page can flip its `loaded` flag. It then unmounts itself.
 */
export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [done, setDone] = useState(false);

  // Keep the latest callback without retriggering the effect.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Reduced motion, test mode, or already seen in session: reveal page instantly.
    const hasSeen = typeof window !== "undefined" && sessionStorage.getItem("portfolio_preloader_seen");

    if (prefersReducedMotion() || process.env.NEXT_PUBLIC_TEST_MODE === "true" || hasSeen) {
      onCompleteRef.current();
      setDone(true);
      return;
    }

    try {
      sessionStorage.setItem("portfolio_preloader_seen", "true");
    } catch {}

    // Lock scroll while the loader is on screen.
    document.body.style.overflow = "hidden";

    // Safety fallback timeout to ensure preloader NEVER hangs indefinitely
    const fallbackTimer = setTimeout(() => {
      document.body.style.overflow = "";
      onCompleteRef.current();
      setDone(true);
    }, 4000);

    const counter = { value: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          clearTimeout(fallbackTimer);
          document.body.style.overflow = "";
          onCompleteRef.current();
          setDone(true);
        },
      });

      if (pathRef.current) {
        gsap.set(pathRef.current, { strokeDasharray: 150, strokeDashoffset: 150 });
        tl.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: "power3.inOut",
        }, 0);
      }
      
      if (svgRef.current) {
        tl.to(svgRef.current, {
          rotate: 180,
          duration: 1.6,
          ease: "power3.inOut",
        }, 0);
      }

      tl.to(counter, {
        value: 100,
        duration: 1.6,
        ease: "power3.inOut",
        onUpdate: () => {
          const v = Math.round(counter.value);
          if (numRef.current) numRef.current.textContent = String(v);
          if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
        },
      }, 0);

      // Hold a beat, then reveal the page by sliding the overlay up.
      tl.to(rootRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "expo.inOut",
      }, "+=0.15");
    }, rootRef);

    return () => {
      clearTimeout(fallbackTimer);
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col justify-end bg-black px-6 pb-10 md:px-10 md:pb-12"
      aria-hidden="true"
    >
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-4 mb-2 md:mb-4">
          <svg
            ref={svgRef}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent-amber"
          >
            <path ref={pathRef} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="font-mono text-meta uppercase tracking-[0.2em] text-fg-muted">
            Loading
          </span>
        </div>
        <span className="flex items-baseline font-display text-[18vw] leading-none tracking-tighter text-fg-primary md:text-[12vw]">
          <span ref={numRef}>0</span>
          <span className="text-fg-muted">%</span>
        </span>
      </div>

      {/* progress rule */}
      <div className="mt-6 h-px w-full origin-left bg-fg-primary/15">
        <span
          ref={barRef}
          className="block h-px w-full origin-left scale-x-0 bg-fg-primary"
        />
      </div>
    </div>
  );
}
