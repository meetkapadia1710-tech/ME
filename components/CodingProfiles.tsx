"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";
import { DUR_STANDARD, REVEAL_Y_PCT, EASE_ENTRANCE } from "@/lib/motion";

const PROFILES = [
  {
    platform: "LeetCode",
    stat: "500+ Problems Solved",
    href: "https://leetcode.com/Code-Hacker_17",
    icon: "⚡",
  },
  {
    platform: "CodeChef",
    stat: "1462 Rating",
    href: "https://www.codolio.com/profile/Lucifer_17",
    icon: "★",
  },
];

export default function CodingProfiles({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready) return;
    return createRevealContext(rootRef, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
          once: true,
        },
      });
      
      tl.from("[data-cp-heading]", {
        yPercent: REVEAL_Y_PCT,
        opacity: 0,
        duration: DUR_STANDARD,
        ease: EASE_ENTRANCE,
      });
      
      // tl.from(
      //   "[data-cp-pill]",
      //   {
      //     y: 20,
      //     opacity: 0,
      //     scale: 0.95,
      //     duration: DUR_FAST,
      //     ease: EASE_ENTRANCE,
      //     stagger: 0.1,
      //   },
      //   "-=0.4",
      // );
    });
  }, [ready]);

  return (
    <section
      ref={rootRef}
      className="border-t border-fg-primary/10 px-6 py-12 md:px-10 md:py-16"
    >
      <div className="grid gap-6 md:grid-cols-12 md:items-center">
        <div className="md:col-span-3">
          <div className="overflow-hidden">
            <span
              data-cp-heading
              className="inline-block font-mono text-meta uppercase tracking-[0.15em] text-fg-muted"
            >
              Competitive Programming
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 md:col-span-9">
          {PROFILES.map((p) => (
            <a
              key={p.platform}
              data-cp-pill
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 rounded-full border border-fg-primary/20 bg-fg-primary/5 px-4 py-2 font-mono text-meta tracking-wider text-fg-muted transition-all duration-200 hover:border-fg-primary/40 hover:bg-fg-primary/10 hover:text-fg-primary"
            >
              <span aria-hidden className="text-fg-primary/40 group-hover:text-fg-primary/70 transition-colors">
                {p.icon}
              </span>
              <span className="text-fg-primary/80 group-hover:text-fg-primary transition-colors">
                {p.platform}
              </span>
              <span className="text-fg-primary/40 group-hover:text-fg-primary/60 transition-colors">
                — {p.stat}
              </span>
              <span
                aria-hidden
                className="ml-0.5 inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
