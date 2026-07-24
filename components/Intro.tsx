"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";
import {
  EASE_ENTRANCE, EASE_SPRING,
  DUR_STANDARD, DUR_SLOW,
  STAGGER_TIGHT, STAGGER_LOOSE,
  REVEAL_Y_PCT, REVEAL_ROTATE_X, REVEAL_PERSPECTIVE,
} from "@/lib/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Intro / short bio.
 * Reuses Hero's reveal language (slide-up + fade, power3.out, staggered),
 * but fires on scroll-into-view via ScrollTrigger instead of the preloader
 * flag. `[data-reveal]` elements sit inside overflow-hidden masks.
 */
export default function Intro({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ready) return;
    return createRevealContext(rootRef, () => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal-heading]");
      gsap.from(targets, {
        yPercent: REVEAL_Y_PCT,
        opacity: 0,
        rotateX: REVEAL_ROTATE_X,
        transformPerspective: REVEAL_PERSPECTIVE,
        duration: DUR_SLOW,
        ease: EASE_ENTRANCE,
        stagger: STAGGER_LOOSE,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
          once: true,
        },
      });

      if (textRef.current) {
        const words = textRef.current.querySelectorAll(".word-reveal");
        gsap.fromTo(words, 
          { yPercent: 120, opacity: 0, rotateX: 50 },
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: DUR_STANDARD,
            ease: EASE_SPRING,
            stagger: STAGGER_TIGHT,
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 85%",
              once: true,
            }
          }
        );
      }
    });
  }, [ready]);

  return (
    <section
      ref={rootRef}
      className="divider-top bg-background px-6 py-32 md:px-10 md:py-48"
    >
      <SectionHeading
        label="Intro"
        title={
          <p
            ref={textRef}
            className="font-display text-heading-md leading-[1.2] tracking-tight text-fg-primary md:text-heading-lg flex flex-wrap"
          >
            {"Currently pursuing a B.Tech in Computer Science at IIIT Vadodara (2024–2028), building full-stack products end to end — from interface to backend to deployment. I care as much about how something feels to use as how it's built underneath."
              .split(" ")
              .map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.3em] pb-1">
                  <span className="word-reveal inline-block origin-bottom">{word}</span>
                </span>
              ))}
          </p>
        }
      />
    </section>
  );
}
