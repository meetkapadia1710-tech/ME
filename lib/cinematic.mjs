/**
 * Single source of truth for the pre-rendered cinematic frame sequence.
 *
 * Shared by three places that MUST agree:
 *   - components/CinematicScrub.tsx      (requests frames at runtime)
 *   - app/cinematic-render/page.tsx      (the offline render target)
 *   - scripts/render-cinematic-frames.mjs (produces the files)
 *
 * They drifted once: the render script was interrupted after 66 frames while
 * the scrubber kept asking for 120, so 54 requests 404'd on every homepage
 * visit and the canvas froze for the last ~45% of the scroll. Hence one
 * constant, imported everywhere, rather than three literals.
 *
 * Plain .mjs so the Node render script and the bundled app can both import it.
 */

/** Frame count in public/cinematic. Re-run the render script after changing. */
export const TOTAL_CINEMATIC_FRAMES = 120;

/** e.g. `frame-0042.jpeg` */
export function cinematicFrameFileName(index) {
  return `frame-${index.toString().padStart(4, "0")}.jpeg`;
}

/** e.g. `/cinematic/frame-0042.jpeg` */
export function cinematicFrameUrl(index) {
  return `/cinematic/${cinematicFrameFileName(index)}`;
}
