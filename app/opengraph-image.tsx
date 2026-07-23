import { OG_ALT, OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const runtime = "edge";
export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = "image/png";

/**
 * Dynamically generated 1200×630 social card — no binary asset required.
 * Replace with custom artwork by dropping a static opengraph-image.png here.
 */
export default function OpengraphImage() {
  return renderOgImage();
}
