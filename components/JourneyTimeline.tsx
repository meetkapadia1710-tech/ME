"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/reveal";
import {
  EASE_ENTRANCE,
  EASE_STANDARD,
  EASE_SPRING,
  DUR_STANDARD,
  DUR_FAST,
  DUR_SLOW,
  STAGGER_TIGHT,
} from "@/lib/motion";

const NODES = [
  {
    year: "2023",
    title: "First lines shipped",
    body: "Started building real things: JARVIS (offline AI assistant), early finance tools, and the first client sites. Mostly Python, React, and late nights.",
  },
  {
    year: "2024",
    title: "B.Tech CSE @ IIIT Vadodara",
    body: "Joined the program in August. Kept shipping in parallel — BD Buildcon, Bhumi Developers, hackathon finishes at HackBaroda and DAIICT.",
  },
  {
    year: "2024–25",
    title: "Full-stack + mobile",
    body: "PlayHub (React Native + Razorpay), LocateMe Family (Android), RepoGrade (AI-powered repo scoring). Started going deeper on systems and performance.",
  },
  {
    year: "Now",
    title: "Pushing toward SDE / systems",
    body: "RISC-V processor in Verilog, this portfolio in WebGL + GSAP. Actively looking for SDE / full-stack internships where I can own a real slice of the stack.",
    current: true,
  },
] as const;

export default function JourneyTimeline() {
  const rootRef = useRef<HTMLElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (prefersReducedMotion()) return;

    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Animate heading label
      gsap.from("[data-journey-heading]", {
        yPercent: 110,
        opacity: 0,
        duration: DUR_SLOW,
        ease: EASE_ENTRANCE,
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          once: true,
        },
      });

      // Animate each node sequentially as it enters view
      NODES.forEach((_, i) => {
        const line = linesRef.current[i];
        const dot = dotsRef.current[i];
        const content = contentsRef.current[i];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: dot,
            start: "top 78%",
            once: true,
          },
        });

        // 1. Connector line draws downward via clipPath
        if (line) {
          gsap.set(line, { clipPath: "inset(0 0 100% 0)" });
          tl.to(
            line,
            {
              clipPath: "inset(0 0 0% 0)",
              duration: DUR_STANDARD,
              ease: EASE_ENTRANCE,
            },
            0,
          );
        }

        // 2. Dot scales in
        if (dot) {
          gsap.set(dot, { scale: 0, opacity: 0 });
          tl.to(
            dot,
            {
              scale: 1,
              opacity: 1,
              duration: DUR_FAST,
              ease: EASE_SPRING,
            },
            0.1,
          );
        }

        // 3. Content slides up
        if (content) {
          gsap.set(content, { y: 24, opacity: 0 });
          tl.to(
            content,
            {
              y: 0,
              opacity: 1,
              duration: DUR_STANDARD,
              ease: EASE_STANDARD,
              stagger: STAGGER_TIGHT,
            },
            0.2,
          );
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="border-t border-foreground/10 py-20 md:py-28"
    >
      {/* Section label */}
      <div className="mb-12 overflow-hidden md:mb-16">
        <span
          data-journey-heading
          className="inline-block font-mono text-xs uppercase tracking-[0.15em] text-foreground/50"
        >
          Journey
        </span>
      </div>

      {/* Timeline */}
      <div className="relative ml-4 md:ml-24">
        {NODES.map((node, i) => {
          const isLast = i === NODES.length - 1;
          return (
            <div key={node.year} className="relative flex gap-8 md:gap-12">
              {/* Left column: connector line + dot */}
              <div className="relative flex flex-col items-center">
                {/* Vertical connector (hidden for last node) */}
                {!isLast && (
                  <div
                    ref={(el) => { linesRef.current[i] = el; }}
                    aria-hidden
                    className="absolute top-3 left-1/2 w-px -translate-x-1/2 bg-foreground/20"
                    style={{ height: "calc(100% + 2rem)", top: "0.75rem" }}
                  />
                )}

                {/* Dot */}
                <div
                  ref={(el) => { dotsRef.current[i] = el; }}
                  className={`relative z-10 mt-1 h-2.5 w-2.5 rounded-full border ${
                    'current' in node && node.current
                      ? "border-emerald-400 bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.4)]"
                      : "border-foreground/30 bg-foreground/10"
                  }`}
                >
                  {'current' in node && node.current && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400/40" />
                  )}
                </div>
              </div>

              {/* Right column: content */}
              <div
                ref={(el) => { contentsRef.current[i] = el; }}
                className="pb-12 last:pb-0"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/40">
                  {node.year}
                </span>
                <h3 className="mt-1 font-display text-2xl tracking-tight text-foreground md:text-3xl">
                  {node.title}
                </h3>
                <p className="mt-3 max-w-lg font-mono text-sm leading-relaxed text-foreground/55">
                  {node.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
