import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "Meet Kapadia — Full-Stack Developer";

/**
 * Shared 1200×630 social card renderer, used by both opengraph-image and
 * twitter-image. Each route file declares its own literal `runtime`/`size`
 * exports (Next requires literals there) and delegates rendering here.
 */
export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          color: "#ece9e1",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#8a8880",
          }}
        >
          Full-Stack Developer · SDE
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 130,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            Meet Kapadia
          </div>
          <div style={{ fontSize: 34, color: "#a7a49c", marginTop: 24 }}>
            Building full products end to end · Gujarat, India
          </div>
        </div>
        <div
          style={{
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#6f6d66",
          }}
        >
          Currently available for internships
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
