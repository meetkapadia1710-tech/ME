"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createRevealContext } from "@/lib/reveal";
import {
  EASE_ENTRANCE,
  EASE_STANDARD,
  DUR_SLOW,
  DUR_STANDARD,
  STAGGER_LOOSE,
} from "@/lib/motion";

/**
 * Closing CTA for /approach — full-height-ish section with a scoped WebGL
 * distortion mesh behind the copy. The 3D element rotates as you scroll into
 * this section, and drifts with the pointer.
 */
export default function ApproachCTA() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);



    const cleanup = createRevealContext(rootRef, () => {
      // Word-level reveal on the headline
      const words = rootRef.current?.querySelectorAll("[data-cta-word]");
      if (words) {
        gsap.fromTo(
          Array.from(words),
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: DUR_SLOW,
            ease: EASE_ENTRANCE,
            stagger: STAGGER_LOOSE * 0.5,
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 75%",
              once: true,
            },
          },
        );
      }

      const items = rootRef.current?.querySelectorAll("[data-cta-reveal]");
      if (items) {
        gsap.from(Array.from(items), {
          yPercent: 110,
          opacity: 0,
          duration: DUR_STANDARD,
          ease: EASE_STANDARD,
          stagger: STAGGER_LOOSE,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            once: true,
          },
        });
      }
    });

    return () => {
      cleanup?.();
    };
  }, []);

  const HEADLINE = "If you're building something worth shipping, let's talk.";

  return (
    <section
      ref={rootRef}
      className="relative min-h-[65vh] overflow-hidden divider-top bg-background flex items-center py-32 md:py-48"
    >


      {/* Copy */}
      <div className="relative z-10 grid w-full gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="overflow-hidden">
            <span
              data-cta-reveal
              className="inline-block font-mono text-meta text-fg-muted"
            >
              Next step
            </span>
          </div>
        </div>

        <div className="md:col-span-9">
          {/* Headline — word-by-word reveal */}
          <h2 className="max-w-2xl font-display text-heading-md leading-[1.15] tracking-tight text-fg-primary md:text-heading-lg">
            {HEADLINE.split(" ").map((word, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden mr-[0.25em] mb-1"
              >
                <span
                  data-cta-word
                  className="inline-block origin-bottom"
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>

          {/* Supporting lines */}
          <div className="mt-8 max-w-xl overflow-hidden">
            <p
              data-cta-reveal
              className="font-mono text-body-sm leading-relaxed text-fg-muted"
            >
              I&apos;m open to SDE / full-stack internship roles where I can own
              a meaningful slice of the product — from schema to interface.
            </p>
          </div>

          {/* Availability pill */}
          <div className="mt-6 overflow-hidden">
            <span
              data-cta-reveal
              className="inline-flex items-center gap-2.5 font-mono text-meta text-fg-primary/70"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Available now — Gujarat, India
            </span>
          </div>

          {/* CTA link */}
          <div className="mt-10 overflow-hidden">
            <Link
              data-cta-reveal
              href="/#reach-out"
              className="group inline-flex items-center gap-3 font-mono text-body-sm uppercase tracking-[0.15em] text-fg-muted transition-colors hover:text-fg-primary"
            >
              Reach out
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
