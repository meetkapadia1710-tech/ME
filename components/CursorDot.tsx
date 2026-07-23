"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { prefersReducedMotion } from "@/lib/reveal";

export default function CursorDot() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isReduced = prefersReducedMotion();

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  useEffect(() => {
    if (isReduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.classList.add("hide-cursor");

    const onMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      // Offset by half of cursor size (7px) to center it
      cursorX.set(e.clientX - 7);
      cursorY.set(e.clientY - 7);
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
  }, [isVisible, isReduced, cursorX, cursorY]);

  if (isReduced) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0,
        scale: isHovering ? 3 : 1,
      }}
      className="pointer-events-none fixed left-0 top-0 z-[95] h-3.5 w-3.5 rounded-full bg-white mix-blend-difference"
    />
  );
}
