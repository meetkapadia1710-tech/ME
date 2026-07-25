"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { prefersReducedMotion } from "@/lib/reveal";

export default function CursorDot() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isReduced = prefersReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (isReduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.classList.add("hide-cursor");

    const onMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
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
  }, [isVisible, isReduced, mouseX, mouseY]);

  if (isReduced) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{
          x: mouseX,
          y: mouseY,
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 0 : 1,
        }}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 rounded-full bg-white mix-blend-difference flex items-center justify-center origin-center"
      >
        <div className="h-2 w-2 rounded-full bg-black" />
      </motion.div>
      <motion.div
        aria-hidden
        style={{
          x: smoothX,
          y: smoothY,
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 2.5 : 1,
        }}
        className="pointer-events-none fixed left-0 top-0 z-[99] h-8 w-8 rounded-full border border-white mix-blend-difference origin-center"
      />
    </>
  );
}
