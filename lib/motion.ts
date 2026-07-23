/**
 * Site-wide GSAP motion constants.
 * Import these everywhere instead of using inline magic numbers.
 * A single edit here re-tunes the entire site.
 */

// Easing
export const EASE_STANDARD = "power2.out";
export const EASE_ENTRANCE = "power3.out";
export const EASE_EXIT     = "power3.inOut";
export const EASE_SPRING   = "back.out(1.4)";

// Durations (seconds)
export const DUR_FAST     = 0.55; // micro-interactions, underlines, pills
export const DUR_STANDARD = 0.75; // scroll-reveal rows
export const DUR_SLOW     = 1.0;  // hero-level entrances, headings

// Stagger
export const STAGGER_TIGHT = 0.08;
export const STAGGER_LOOSE = 0.12;

// Scroll reveal defaults (used in gsap.from calls)
export const REVEAL_Y        = 40;   // px — row slide-up
export const REVEAL_Y_PCT    = 110;  // % — text mask slide-up
export const REVEAL_OPACITY  = 0;
export const REVEAL_ROTATE_X = 25;   // deg — 3-D entrance tilt
export const REVEAL_PERSPECTIVE = 1000; // px
