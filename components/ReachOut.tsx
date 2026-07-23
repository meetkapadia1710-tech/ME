"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";

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
        yPercent: 110,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
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
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const retractUnderline = () => {
    if (!underlineRef.current) return;
    gsap.to(underlineRef.current, {
      scaleX: 0,
      transformOrigin: "right center",
      duration: 0.4,
      ease: "power3.out",
    });
  };

  return (
    <section
      id="reach-out"
      ref={rootRef}
      className="scroll-mt-24 border-t border-foreground/10 px-6 py-24 md:px-10 md:py-32"
    >
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="overflow-hidden">
            <span
              data-reveal
              className="inline-block font-mono text-xs uppercase tracking-[0.15em] text-foreground/50"
            >
              Reach Out
            </span>
          </div>
        </div>

        <div className="md:col-span-9">
          {/* CTA */}
          <div className="max-w-2xl overflow-hidden">
            <p
              data-reveal
              className="font-display text-2xl leading-[1.2] tracking-tight text-foreground md:text-4xl"
            >
              Have a project or role in mind? I&apos;d love to hear about it.
            </p>
          </div>

          {/* Email */}
          <div className="mt-10 overflow-hidden">
            <a
              data-reveal
              href={`mailto:${EMAIL}`}
              onMouseEnter={drawUnderline}
              onMouseLeave={retractUnderline}
              onFocus={drawUnderline}
              onBlur={retractUnderline}
              className="group relative inline-block font-display text-2xl tracking-tight text-foreground/85 transition-colors duration-300 hover:text-foreground focus:text-foreground focus:outline-none sm:text-3xl md:text-5xl"
            >
              <span className="break-all">{EMAIL}</span>
              <span
                ref={underlineRef}
                aria-hidden
                className="absolute -bottom-1 left-0 block h-px w-full origin-left scale-x-0 bg-foreground md:-bottom-2"
              />
            </a>
          </div>

          {/* Meta */}
          <div className="mt-12 overflow-hidden">
            <div
              data-reveal
              className="flex flex-col gap-3 font-mono text-xs uppercase tracking-[0.15em] text-foreground/50 sm:flex-row sm:items-center sm:gap-6"
            >
              <span className="inline-flex items-center gap-2.5 text-foreground/70">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Available for SDE / full-stack internships
              </span>
              <span aria-hidden className="hidden text-foreground/25 sm:inline">
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
