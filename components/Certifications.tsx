"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";
import { EASE_ENTRANCE, DUR_STANDARD, DUR_FAST, REVEAL_Y_PCT } from "@/lib/motion";

const CERTS = [
  {
    name: "Oracle OCI Generative AI Professional",
    issuer: "Oracle",
    year: "2024",
  },
  {
    name: "Full Stack Web Dev — Delta / MERN",
    issuer: "Apna College",
    year: "2023",
  },
  {
    name: "AI Workshop",
    issuer: "IIT Bombay",
    year: "2024",
  },
];

export default function Certifications({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready) return;
    return createRevealContext(rootRef, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          once: true,
        },
      });
      
      tl.from("[data-cert-heading]", {
        yPercent: REVEAL_Y_PCT,
        opacity: 0,
        duration: DUR_STANDARD,
        ease: EASE_ENTRANCE,
      });
      
      tl.from(
        "[data-cert-item]",
        {
          y: 16,
          opacity: 0,
          duration: DUR_FAST,
          ease: EASE_ENTRANCE,
          stagger: 0.08,
        },
        "-=0.5",
      );
    });
  }, [ready]);

  return (
    <section
      ref={rootRef}
      className="border-t border-foreground/10 px-6 py-12 md:px-10 md:py-16"
    >
      <div className="grid gap-6 md:grid-cols-12 md:items-start">
        <div className="md:col-span-3">
          <div className="overflow-hidden">
            <span
              data-cert-heading
              className="inline-block font-mono text-xs uppercase tracking-[0.15em] text-foreground/50"
            >
              Certifications
            </span>
          </div>
        </div>

        <ul className="flex flex-col gap-4 md:col-span-9">
          {CERTS.map((cert) => (
            <li
              key={cert.name}
              data-cert-item
              className="flex flex-col gap-0.5 border-b border-foreground/[0.07] pb-4 last:border-none last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="font-mono text-sm text-foreground/80">
                {cert.name}
              </span>
              <span className="flex shrink-0 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/40">
                <span>{cert.issuer}</span>
                <span aria-hidden className="text-foreground/20">
                  /
                </span>
                <span>{cert.year}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
