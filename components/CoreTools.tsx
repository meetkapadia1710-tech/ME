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
import { SectionHeading } from "@/components/ui/SectionHeading";

export const TOOLS = [
  {
    name: "TypeScript / Next.js",
    description:
      "Primary stack for building fast, type-safe web applications end to end, from routing to API layer.",
  },
  {
    name: "Tailwind CSS",
    description:
      "Utility-first styling that keeps design and implementation in the same place, built for iterating quickly without breaking consistency.",
  },
  {
    name: "Firebase",
    description:
      "Real-time backend, auth, and storage for mobile and web apps that need to feel instant.",
  },
  {
    name: "Python / Django",
    description:
      "Backend and data-heavy work — structured APIs, admin tooling, and reporting.",
  },
];

/**
 * Core Tools — 4 picks with a short "why it matters" line each.
 * A single GSAP timeline (one ScrollTrigger) reveals the heading, then
 * staggers the four rows, matching Hero/Intro's slide-up + fade language.
 */
export default function CoreTools({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready) return;
    return createRevealContext(rootRef, () => {
      const heading = gsap.utils.toArray<HTMLElement>("[data-reveal-heading]");
      const rows = gsap.utils.toArray<HTMLElement>("[data-reveal-row]");

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
  }, [ready]);

  return (
    <section
      ref={rootRef}
      className="divider-top bg-background px-6 py-32 md:px-10 md:py-48"
    >
      <SectionHeading label="Core Tools" className="mb-0 md:mb-0" />
      
      <div className="grid gap-10 md:grid-cols-12 mt-10 md:mt-12">
        <div className="md:col-span-3 hidden md:block"></div>
        <ul className="md:col-span-9">
          {TOOLS.map((tool, i) => (
            <li
              key={tool.name}
              data-reveal-row
              className="grid grid-cols-1 gap-3 border-t border-fg-primary/10 py-8 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-6"
            >
              <div className="flex items-baseline gap-4 md:col-span-6">
                <span className="font-mono text-meta tabular-nums text-fg-muted">
                  0{i + 1}
                </span>
                <h3 className="font-display text-heading-md tracking-tight text-fg-primary md:text-heading-lg">
                  {tool.name}
                </h3>
              </div>
              <p className="max-w-md font-mono text-body-sm leading-relaxed text-fg-muted md:col-span-6">
                {tool.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
