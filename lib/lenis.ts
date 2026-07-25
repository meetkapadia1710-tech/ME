import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tempus from "tempus";

// Module-level handle so route transitions can reset scroll on navigation.
let lenisInstance: Lenis | null = null;

/** The live Lenis instance, or null before SmoothScroll has mounted. */
export function getLenis() {
  return lenisInstance;
}

/**
 * Boots Lenis smooth scroll and wires it to GSAP's ScrollTrigger.
 */
export function initSmoothScroll() {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  lenisInstance = lenis;

  // Keep ScrollTrigger's cached positions in sync with Lenis.
  lenis.on("scroll", ScrollTrigger.update);

  // Subscribe Lenis to Tempus
  const unsubscribeLenis = Tempus.add((state) => {
    lenis.raf(state.time);
  }, { order: 0 });

  return () => {
    unsubscribeLenis?.();
    lenis.off("scroll", ScrollTrigger.update);
    lenis.destroy();
    if (lenisInstance === lenis) lenisInstance = null;
  };
}
