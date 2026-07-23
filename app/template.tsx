"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { getLenis } from "@/lib/lenis";
import { prefersReducedMotion } from "@/lib/reveal";
import { EASE_ENTRANCE, EASE_EXIT, DUR_STANDARD, DUR_FAST } from "@/lib/motion";

/**
 * Route-level transition wrapper.
 * Uses GSAP power3 curves instead of Framer Motion springs so easing
 * is consistent with the scroll-reveal language used everywhere else.
 *
 * On mount  → fade + slide in  (power3.out)
 * On unmount → fade + slide out (power3.inOut) — handled by key remount
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isReduced = prefersReducedMotion();

  // Scroll to top on route change
  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true });
  }, [pathname]);

  // Entrance animation on every mount (pathname drives remount via `key` in layout)
  useEffect(() => {
    if (isReduced || !wrapperRef.current) return;

    // Start invisible and below
    gsap.set(wrapperRef.current, { opacity: 0, y: 18 });

    const tl = gsap.timeline();
    tl.to(wrapperRef.current, {
      opacity: 1,
      y: 0,
      duration: DUR_STANDARD,
      ease: EASE_ENTRANCE,
      delay: 0.05, // tiny gap so previous page finishes its exit
      clearProps: "opacity,transform",
    });

    return () => { tl.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Exit: fire before unmount — we get one render cycle to kick it off
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || isReduced) return;
    return () => {
      // Route is changing — briefly animate out (best-effort, ~200 ms)
      gsap.to(el, {
        opacity: 0,
        y: -12,
        duration: DUR_FAST * 0.7,
        ease: EASE_EXIT,
        overwrite: true,
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div ref={wrapperRef}>
      {children}
    </div>
  );
}
