"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/reveal";

/**
 * Signature custom cursor: a small dot that follows the pointer, inverts over
 * content (mix-blend-difference), and scales up over links / Selected Works
 * rows. Fine-pointer devices only — skipped entirely on touch and under
 * reduced motion, where the native cursor stays in charge.
 */
export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    document.documentElement.classList.add("hide-cursor");
    gsap.set(dot, { xPercent: -50, yPercent: -50, scale: 1, opacity: 0 });

    const xTo = gsap.quickTo(dot, "x", { duration: 0.3, ease: "power3" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.3, ease: "power3" });

    let shown = false;
    const onMove = (e: MouseEvent) => {
      if (!shown) {
        shown = true;
        gsap.to(dot, { opacity: 1, duration: 0.3 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest?.(
        "a, button, [data-cursor-hover]",
      );
      gsap.to(dot, { scale: interactive ? 3 : 1, duration: 0.3, ease: "power3" });
    };
    const onLeaveWindow = () => gsap.to(dot, { opacity: 0, duration: 0.3 });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.documentElement.classList.remove("hide-cursor");
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[95] h-3.5 w-3.5 rounded-full bg-white mix-blend-difference"
      style={{ willChange: "transform" }}
    />
  );
}
