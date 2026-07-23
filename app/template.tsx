"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/lib/lenis";
import { prefersReducedMotion } from "@/lib/reveal";

/**
 * app/template.tsx remounts on every navigation (unlike layout.tsx), so it's
 * the natural home for a per-route transition. On each route change we:
 *   1. reset Lenis to the top (Next's native scroll reset doesn't reach Lenis),
 *   2. refresh ScrollTrigger against the new page's layout,
 *   3. play a brief fade-in (skipped under reduced motion).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();

    if (prefersReducedMotion() || !ref.current) return;
    const anim = gsap.fromTo(
      ref.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" },
    );
    return () => {
      anim.kill();
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
