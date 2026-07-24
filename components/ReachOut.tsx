"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";
import {
  EASE_ENTRANCE,
  DUR_SLOW,
  STAGGER_LOOSE,
  REVEAL_Y_PCT, REVEAL_ROTATE_X, REVEAL_PERSPECTIVE,
} from "@/lib/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { submitContactForm } from "@/app/actions/contact";



/**
 * Reach Out — contact / CTA.
 * Scroll reveal matches prior sections. The email is a large mailto link with
 * a GSAP underline that draws in from the left on hover and retracts to the
 * right on leave.
 */
export default function ReachOut({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [state, formAction] = useFormState(submitContactForm, null);

  useEffect(() => {
    if (state?.success) {
      setStatus("success");
    } else if (state?.error) {
      setStatus("error");
      setErrorMessage(state.error);
    }
  }, [state]);

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

          {/* Form */}
          <div className="mt-10 max-w-2xl overflow-hidden" data-reveal>
            {status === "success" ? (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-6 text-emerald-400">
                <p className="font-mono text-body-sm">Message sent successfully! I&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-mono text-meta-sm uppercase tracking-widest text-fg-muted">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      className="rounded-none border-b border-fg-primary/20 bg-transparent py-2 font-display text-body-md text-fg-primary transition-colors focus:border-fg-primary focus:outline-none disabled:opacity-50"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-mono text-meta-sm uppercase tracking-widest text-fg-muted">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      className="rounded-none border-b border-fg-primary/20 bg-transparent py-2 font-display text-body-md text-fg-primary transition-colors focus:border-fg-primary focus:outline-none disabled:opacity-50"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-mono text-meta-sm uppercase tracking-widest text-fg-muted">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    required 
                    className="resize-none rounded-none border-b border-fg-primary/20 bg-transparent py-2 font-display text-body-md text-fg-primary transition-colors focus:border-fg-primary focus:outline-none disabled:opacity-50"
                    placeholder="Hello! I'd like to talk about..."
                  />
                </div>
                {status === "error" && (
                  <p className="font-mono text-body-sm text-red-400">{errorMessage}</p>
                )}
                <div className="mt-2 flex">
                  <button 
                    type="submit" 
                    className="group relative inline-flex items-center gap-4 font-mono text-meta uppercase tracking-[0.15em] text-fg-primary transition-colors hover:text-emerald-400 disabled:opacity-50"
                  >
                    Send Message
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </form>
            )}
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
