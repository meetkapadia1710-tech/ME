import { OG_ALT, OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const runtime = "edge";
export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = "image/png";

// Twitter card reuses the same generated card as Open Graph.
export default function TwitterImage() {
  return renderOgImage();
}
