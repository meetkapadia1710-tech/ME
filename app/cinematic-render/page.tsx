import { notFound } from "next/navigation";
import CinematicRenderClient from "./render-client";

/**
 * Internal render target for scripts/render-cinematic-frames.mjs, which drives
 * this route with Playwright to screenshot each frame of the scroll sequence.
 *
 * It is not a real page: it mounts a full R3F scene and was the single heaviest
 * route in the build (397 kB), publicly reachable and indexable in production
 * for no reason. The render script runs against `npm run dev`, so gating on
 * production costs nothing and keeps it off the live site.
 */
export default function CinematicRenderPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CinematicRenderClient />;
}
