import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Module-level handle so route transitions can reset scroll on navigation.
let lenisInstance: Lenis | null = null;

/** The live Lenis instance, or null before SmoothScroll has mounted. */
export function getLenis() {
  return lenisInstance;
}

/**
 * Boots Lenis smooth scroll and wires it to GSAP's ScrollTrigger.
 *
 * Lenis scrolls the root (window) natively, so the officially recommended
 * integration is used here: drive Lenis from GSAP's ticker and push every
 * Lenis scroll event into ScrollTrigger.update(). A `scrollerProxy` is only
 * needed when Lenis is bound to a nested scroll container — not for
 * root-level smooth scroll — so it is intentionally omitted.
 *
 * Returns a cleanup function that tears everything down (call it from the
 * effect that starts the scroll).
 */
export function initSmoothScroll() {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    // gentle exponential ease-out
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  lenisInstance = lenis;

  // Keep ScrollTrigger's cached positions in sync with Lenis.
  lenis.on("scroll", ScrollTrigger.update);

  // GSAP ticker gives time in seconds; Lenis.raf expects milliseconds.
  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    lenis.off("scroll", ScrollTrigger.update);
    gsap.ticker.remove(raf);
    lenis.destroy();
    if (lenisInstance === lenis) lenisInstance = null;
  };
}
