"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/reveal";

export default function CursorDot() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isReduced = prefersReducedMotion();

  useEffect(() => {
    if (isReduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.classList.add("hide-cursor");

    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.15, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.15, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      xTo(e.clientX - 7);
      yTo(e.clientY - 7);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest?.("a, button, [data-cursor-hover]");
      setIsHovering(!!interactive);
    };

    const onLeaveWindow = () => setIsVisible(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.documentElement.classList.remove("hide-cursor");
    };
  }, [isVisible, isReduced]);

  if (isReduced) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `scale(${isHovering ? 3 : 1})`,
        transition: "opacity 0.2s, transform 0.2s ease-out",
      }}
      className="pointer-events-none fixed left-0 top-0 z-[95] h-3.5 w-3.5 rounded-full bg-white mix-blend-difference"
    />
  );
}
