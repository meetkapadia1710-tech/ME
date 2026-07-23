"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";

/**
 * Closing CTA for /approach — soft nudge toward the contact section
 * on the index page. Reveal mirrors ReachOut's yPercent slide-up.
 */
export default function ApproachCTA() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    return createRevealContext(rootRef, () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-cta-reveal]");
      gsap.from(items, {
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
  }, []);

  return (
    <section
      ref={rootRef}
      className="border-t border-foreground/10 py-20 md:py-28"
    >
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="overflow-hidden">
            <span
              data-cta-reveal
              className="inline-block font-mono text-xs uppercase tracking-[0.15em] text-foreground/50"
            >
              Next step
            </span>
          </div>
        </div>

        <div className="md:col-span-9">
          <div className="max-w-2xl overflow-hidden">
            <p
              data-cta-reveal
              className="font-display text-2xl leading-[1.2] tracking-tight text-foreground md:text-4xl"
            >
              Curious how this applies to a specific project or role?
            </p>
          </div>

          <div className="mt-10 overflow-hidden">
            <Link
              data-cta-reveal
              href="/#reach-out"
              className="group inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.15em] text-foreground/60 transition-colors hover:text-foreground"
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
