import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

/** True when the user has asked the OS to minimise non-essential motion or if in test mode. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  if (process.env.NEXT_PUBLIC_TEST_MODE === "true") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Runs `build` inside a gsap.context scoped to `scope`, but waits until web
 * fonts have settled before creating any ScrollTriggers.
 *
 * Why: next/font loads Space Grotesk / Space Mono asynchronously (display
 * swap). If triggers are measured against fallback-font layout and the real
 * font swaps in later, every section below shifts — and the deepest reveal
 * can mis-fire (or arm at the wrong scroll position) because ScrollTrigger's
 * cached start/end are now stale. Building after `document.fonts.ready`
 * guarantees final layout, so `once: true` reveals stay reliable.
 *
 * Returns a cleanup function for useEffect.
 */
export function createRevealContext(
  scope: RefObject<HTMLElement>,
  build: () => void,
) {
  gsap.registerPlugin(ScrollTrigger);

  // Reduced motion: skip all reveal animations. Content is visible by default
  // (gsap.from is what hides it), so not building leaves everything shown.
  if (prefersReducedMotion()) {
    return () => {};
  }

  let ctx: gsap.Context | undefined;
  let cancelled = false;

  const run = () => {
    if (cancelled || !scope.current) return;
    ctx = gsap.context(build, scope);
    // Layout is final now; make sure any earlier-created triggers agree.
    ScrollTrigger.refresh();
  };

  if (
    typeof document !== "undefined" &&
    "fonts" in document &&
    document.fonts.status !== "loaded"
  ) {
    document.fonts.ready.then(run);
  } else {
    run();
  }

  return () => {
    cancelled = true;
    ctx?.revert();
  };
}
