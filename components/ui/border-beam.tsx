"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
}

export const BorderBeam = ({
  className,
  size = 300,
  duration = 8,
  borderWidth = 1.5,
  colorFrom = "#059669",
  colorTo = "#34d399",
}: BorderBeamProps) => {
  return (
    <div
      style={{
        borderWidth,
        maskImage:
          "linear-gradient(white, white), linear-gradient(white, white)",
        maskClip: "padding-box, border-box",
        maskComposite: "exclude",
        WebkitMaskComposite: "xor",
      }}
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] border-solid border-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100",
        className
      )}
    >
      <div
        style={{
          width: size * 2,
          height: size * 2,
          background: `conic-gradient(from 90deg at 50% 50%, transparent 70%, ${colorFrom}, ${colorTo})`,
          animationDuration: `${duration}s`,
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_8s_linear_infinite]"
      />
    </div>
  );
};
