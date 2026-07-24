"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";
import {
  EASE_ENTRANCE,
  DUR_STANDARD, DUR_SLOW,
  STAGGER_LOOSE,
  REVEAL_Y, REVEAL_Y_PCT,
} from "@/lib/motion";

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
        yPercent: REVEAL_Y_PCT,
        opacity: 0,
        duration: DUR_SLOW,
        ease: EASE_ENTRANCE,
      }).from(
        rows,
        {
          y: REVEAL_Y,
          opacity: 0,
          duration: DUR_STANDARD,
          ease: EASE_ENTRANCE,
          stagger: STAGGER_LOOSE,
        },
        "-=0.5",
      );
    });
  }, []);

  return (
    <section ref={rootRef} className="divider-top py-32 md:py-48">
      {/* Section label */}
      <div className="mb-12 overflow-hidden md:mb-16">
        <span
          data-steps-heading
          className="inline-block font-mono text-meta text-fg-muted uppercase tracking-[0.15em]"
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
            className="grid border-t border-fg-primary/10 py-8 opacity-100 transition-opacity duration-300 last:border-b last:border-fg-primary/10 group-hover/list:opacity-40 hover:!opacity-100 md:grid-cols-12 md:py-10"
          >
            {/* Number + title */}
            <div className="flex items-baseline gap-4 md:col-span-5 md:gap-6">
              <span className="font-mono text-meta tabular-nums text-fg-muted">
                {step.num} / 04
              </span>
              <h2 className="font-display text-heading-md tracking-tight text-fg-primary md:text-heading-lg">
                {step.title}
              </h2>
            </div>

            {/* Body copy */}
            <p className="mt-4 max-w-lg font-mono text-body-sm leading-relaxed text-fg-muted md:col-span-7 md:mt-0 md:self-center">
              {step.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
