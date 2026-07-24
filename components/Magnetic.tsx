"use client";

import { useRef } from "react";
import { motion, useSpring } from "framer-motion";
import { prefersReducedMotion } from "@/lib/reveal";

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
};

export default function Magnetic({ children, className = "", intensity = 0.4 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isReduced = prefersReducedMotion();

  // Physics springs for a very organic, liquid feel
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReduced || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * intensity);
    y.set(middleY * intensity);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div style={{ x, y }}>
        {children}
      </motion.div>
    </div>
  );
}
