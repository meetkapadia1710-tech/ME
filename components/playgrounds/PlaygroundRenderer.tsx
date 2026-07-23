"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { DUR_STANDARD, EASE_ENTRANCE, REVEAL_Y } from "@/lib/motion";

// Lazy-load interactive demos to keep initial bundle size small
const PlayHubDemo = dynamic(() => import("./PlayHubDemo"), {
  loading: () => <div className="flex h-[400px] w-full items-center justify-center rounded-sm bg-foreground/5 text-foreground/50">Loading demo...</div>,
});
const AureDemo = dynamic(() => import("./AureDemo"), {
  loading: () => <div className="flex h-[400px] w-full items-center justify-center rounded-sm bg-foreground/5 text-foreground/50">Loading demo...</div>,
});
const RepoGradeDemo = dynamic(() => import("./RepoGradeDemo"), {
  loading: () => <div className="flex h-[400px] w-full items-center justify-center rounded-sm bg-foreground/5 text-foreground/50">Loading demo...</div>,
});
const LocateMeDemo = dynamic(() => import("./LocateMeDemo"), {
  loading: () => <div className="flex h-[400px] w-full items-center justify-center rounded-sm bg-foreground/5 text-foreground/50">Loading demo...</div>,
});

type PlaygroundProps = {
  type: "none" | "iframe" | "interactive" | "video";
  url?: string | null;
  config?: any;
  projectSlug: string;
};

export default function PlaygroundRenderer({ type, url, config, projectSlug }: PlaygroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasIntersected, setHasIntersected] = useState(false);

  // Use Intersection Observer to only load the heavy content when it's near the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Load slightly before it comes into view
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate in when loaded
  useEffect(() => {
    if (hasIntersected && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: REVEAL_Y, opacity: 0 },
        { y: 0, opacity: 1, duration: DUR_STANDARD, ease: EASE_ENTRANCE }
      );
    }
  }, [hasIntersected]);

  if (type === "none") return null;

  return (
    <div ref={containerRef} className="opacity-0">
      {!hasIntersected ? (
        <div className="flex h-[400px] w-full items-center justify-center rounded-sm bg-foreground/5 text-foreground/50">
          Loading playground...
        </div>
      ) : (
        <>
          {type === "interactive" ? (
            (() => {
              switch (projectSlug) {
                case "playhub":
                  return <PlayHubDemo config={config} />;
                case "aure":
                  return <AureDemo config={config} />;
                case "repograde":
                  return <RepoGradeDemo />;
                case "locateme-family":
                  return <LocateMeDemo />;
                default:
                  return (
                    <div className="flex h-[400px] w-full items-center justify-center rounded-sm border border-dashed border-foreground/20 text-foreground/50">
                      Interactive demo not yet implemented for this project.
                    </div>
                  );
              }
            })()
          ) : null}
          
          {type === "iframe" && url && (
            <div className="relative w-full overflow-hidden rounded-sm bg-foreground/5" style={{ aspectRatio: "16 / 9" }}>
              <iframe
                src={url}
                className="absolute left-0 top-0 h-full w-full border-0"
                sandbox="allow-scripts allow-same-origin"
                title={`${projectSlug} playground embed`}
                loading="lazy"
              />
            </div>
          )}

          {type === "video" && url && (
            <div className="relative w-full overflow-hidden rounded-sm bg-foreground/5" style={{ aspectRatio: "16 / 9" }}>
              <video
                src={url}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
