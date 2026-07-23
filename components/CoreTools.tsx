"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";

const TOOLS = [
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
  }, [ready]);

  return (
    <section
      ref={rootRef}
      className="border-t border-foreground/10 px-6 py-24 md:px-10 md:py-32"
    >
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="overflow-hidden">
            <span
              data-reveal-heading
              className="inline-block font-mono text-xs uppercase tracking-[0.15em] text-foreground/50"
            >
              Core Tools
            </span>
          </div>
        </div>

        <ul className="md:col-span-9">
          {TOOLS.map((tool, i) => (
            <li
              key={tool.name}
              data-reveal-row
              className="grid grid-cols-1 gap-3 border-t border-foreground/10 py-8 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-6"
            >
              <div className="flex items-baseline gap-4 md:col-span-6">
                <span className="font-mono text-xs tabular-nums text-foreground/40">
                  0{i + 1}
                </span>
                <h3 className="font-display text-2xl tracking-tight text-foreground md:text-3xl">
                  {tool.name}
                </h3>
              </div>
              <p className="max-w-md font-mono text-sm leading-relaxed text-foreground/55 md:col-span-6">
                {tool.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
