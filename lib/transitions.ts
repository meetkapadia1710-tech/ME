"use client";

import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/reveal";
import { DUR_STANDARD, EASE_STANDARD } from "@/lib/motion";

export const pageExitTransition = async () => {
  if (prefersReducedMotion()) return Promise.resolve();

  return new Promise<void>((resolve) => {
    // Select the main page content wrapper
    const pageWrapper = document.getElementById("page-content");
    if (!pageWrapper) return resolve();

    gsap.to(pageWrapper, {
      opacity: 0,
      scale: 0.98,
      y: 10,
      duration: DUR_STANDARD,
      ease: EASE_STANDARD,
      onComplete: resolve,
    });
  });
};

export const pageEnterTransition = () => {
  if (prefersReducedMotion()) return;

  const pageWrapper = document.getElementById("page-content");
  if (!pageWrapper) return;

  gsap.fromTo(
    pageWrapper,
    { opacity: 0, scale: 1.02, y: -10 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: DUR_STANDARD,
      ease: EASE_STANDARD,
      clearProps: "all",
    }
  );
};
