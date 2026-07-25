"use client";

import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "hamo";
import Tempus from "tempus";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/reveal";

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  duration = 2,
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [setRef, entry] = useIntersectionObserver({ rootMargin: "0px" });
  const isIntersecting = entry?.isIntersecting ?? false;
  const isReduced = prefersReducedMotion();
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (isReduced) {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(value);
      }
      return;
    }

    if (!isIntersecting || hasTriggered.current) return;
    hasTriggered.current = true;

    let startTime: number | null = null;
    let completed = false;

    const onFrame = (state: { time: number }) => {
      if (completed) return;
      if (startTime === null) startTime = state.time;

      const elapsed = (state.time - startTime) / 1000;
      if (elapsed < delay) return;

      const progress = Math.min((elapsed - delay) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const current = direction === "down" 
        ? value * (1 - ease)
        : value * ease;

      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(
          Math.floor(current)
        );
      }

      if (progress === 1) {
        completed = true;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        unsubscribe?.();
      }
    };

    const unsubscribe = Tempus.add(onFrame, { order: 0 });

    return () => {
      unsubscribe?.();
    };
  }, [value, direction, delay, className, isIntersecting, isReduced, duration]);

  return (
    <span
      className={cn("inline-block tabular-nums tracking-wider", className)}
      ref={(el) => {
        // @ts-expect-error generic ref assignment
        ref.current = el;
        setRef(el);
      }}
    />
  );
}
