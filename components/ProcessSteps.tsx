"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";

const STEPS = [
  {
    num: "01",
    title: "Scope",
    body: "Start with the smallest version that actually works end to end, not the full feature list.",
  },
  {
    num: "02",
    title: "Build in phases",
    body: "Break the build into sequential, testable chunks — each one shippable on its own before the next starts.",
  },
  {
    num: "03",
    title: "Ship, then iterate",
    body: "Get a working version live early. Polish, edge cases, and extras come after, not before.",
  },
  {
    num: "04",
    title: "Own the whole stack",
    body: "Comfortable moving from interface down to backend and deployment — not just one layer.",
  },
] as const;

/**
 * Numbered process steps — same 01/04 visual language as SelectedWorks rows,
 * same GSAP stagger-reveal timing (y: 40, opacity: 0, stagger: 0.12).
 */
export default function ProcessSteps() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    return createRevealContext(rootRef, () => {
      const heading = gsap.utils.toArray<HTMLElement>("[data-steps-heading]");
      const rows = gsap.utils.toArray<HTMLElement>("[data-steps-row]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          once: true,
        },
      });

      tl.from(heading, {
        yPercent: 110,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      }).from(
        rows,
        {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
        },
        "-=0.5",
      );
    });
  }, []);

  return (
    <section ref={rootRef} className="border-t border-foreground/10 py-20 md:py-28">
      {/* Section label */}
      <div className="mb-12 overflow-hidden md:mb-16">
        <span
          data-steps-heading
          className="inline-block font-mono text-xs uppercase tracking-[0.15em] text-foreground/50"
        >
          Process
        </span>
      </div>

      {/* Numbered rows — mirrors SelectedWorks list rhythm */}
      <ul className="group/list">
        {STEPS.map((step) => (
          <li
            key={step.num}
            data-steps-row
            className="grid border-t border-foreground/10 py-8 opacity-100 transition-opacity duration-300 last:border-b last:border-foreground/10 group-hover/list:opacity-40 hover:!opacity-100 md:grid-cols-12 md:py-10"
          >
            {/* Number + title */}
            <div className="flex items-baseline gap-4 md:col-span-5 md:gap-6">
              <span className="font-mono text-xs tabular-nums text-foreground/40">
                {step.num} / 04
              </span>
              <h2 className="font-display text-3xl leading-none tracking-tight text-foreground md:text-5xl">
                {step.title}
              </h2>
            </div>

            {/* Body copy */}
            <p className="mt-4 max-w-lg font-mono text-sm leading-relaxed text-foreground/55 md:col-span-7 md:mt-0 md:self-center">
              {step.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
