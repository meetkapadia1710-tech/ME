"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";
import {
  EASE_ENTRANCE,
  DUR_SLOW, DUR_FAST,
  STAGGER_LOOSE,
  REVEAL_Y_PCT, REVEAL_ROTATE_X, REVEAL_PERSPECTIVE,
} from "@/lib/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

const EMAIL = "meetkapadia1710@gmail.com";

/**
 * Reach Out — contact / CTA.
 * Scroll reveal matches prior sections. The email is a large mailto link with
 * a GSAP underline that draws in from the left on hover and retracts to the
 * right on leave.
 */
export default function ReachOut({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ready) return;
    return createRevealContext(rootRef, () => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
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
    });
  }, [ready]);

  const drawUnderline = () => {
    if (!underlineRef.current) return;
    gsap.to(underlineRef.current, {
      scaleX: 1,
      transformOrigin: "left center",
      duration: DUR_FAST * 0.8,
      ease: EASE_ENTRANCE,
    });
  };

  const retractUnderline = () => {
    if (!underlineRef.current) return;
    gsap.to(underlineRef.current, {
      scaleX: 0,
      transformOrigin: "right center",
      duration: DUR_FAST * 0.7,
      ease: "power2.in",
    });
  };

  return (
    <section
      id="reach-out"
      ref={rootRef}
      className="scroll-mt-24 divider-top bg-background px-6 py-32 md:px-10 md:py-48"
    >
      <SectionHeading label="Reach Out" className="mb-0 md:mb-0" />

      <div className="grid gap-10 md:grid-cols-12 mt-10 md:mt-12">
        <div className="md:col-span-3 hidden md:block"></div>
        <div className="md:col-span-9">
          {/* CTA */}
          <div className="max-w-2xl overflow-hidden">
            <p
              data-reveal
              className="font-display text-heading-md leading-[1.2] tracking-tight text-fg-primary md:text-heading-lg"
            >
              Have a project or role in mind? I&apos;d love to hear about it.
            </p>
          </div>

          {/* Email */}
          <div className="mt-10 overflow-hidden">
            <motion.a
              data-reveal
              href={`mailto:${EMAIL}`}
              onMouseEnter={drawUnderline}
              onMouseLeave={retractUnderline}
              onFocus={drawUnderline}
              onBlur={retractUnderline}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.96, y: 2 }}
              className="group relative inline-block font-display text-heading-md tracking-tight text-fg-primary/85 transition-colors duration-300 hover:text-fg-primary focus:text-fg-primary focus:outline-none sm:text-heading-lg"
            >
              <span className="break-all">{EMAIL}</span>
              <span
                ref={underlineRef}
                aria-hidden
                className="absolute -bottom-1 left-0 block h-px w-full origin-left scale-x-0 bg-fg-primary md:-bottom-2"
              />
            </motion.a>
          </div>

          {/* Meta */}
          <div className="mt-12 overflow-hidden">
            <div
              data-reveal
              className="flex flex-col gap-3 font-mono text-meta text-fg-muted sm:flex-row sm:items-center sm:gap-6"
            >
              <span className="inline-flex items-center gap-2.5 text-fg-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Available for SDE / full-stack internships
              </span>
              <span aria-hidden className="hidden opacity-50 sm:inline">
                /
              </span>
              <span>Gujarat, India</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
