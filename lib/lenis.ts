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

  // Turn off GSAP's internal ticker
  gsap.ticker.remove(gsap.updateRoot);

  // Subscribe Lenis to Tempus
  // Tempus state contains `time` which is equivalent to `performance.now()`
  const unsubscribeLenis = Tempus.add((state) => {
    lenis.raf(state.time);
    gsap.updateRoot(state.time / 1000);
  }, { order: 0 }); // Order 0 ensures Lenis runs early

  return () => {
    unsubscribeLenis?.();
    lenis.off("scroll", ScrollTrigger.update);
    // Restore GSAP's ticker just in case
    gsap.ticker.add(gsap.updateRoot);
    lenis.destroy();
    if (lenisInstance === lenis) lenisInstance = null;
  };
}
