"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/reveal";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function TextScrollReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  
  useEffect(() => {
    if (prefersReducedMotion() || !containerRef.current) return;
    const words = containerRef.current.querySelectorAll(".tsr-word");
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.2, y: 5 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            end: "bottom 60%",
            scrub: true,
          }
        }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <p ref={containerRef} className={cn("flex flex-wrap gap-x-[0.25em] gap-y-[0.1em]", className)}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="tsr-word">
          {word}
        </span>
      ))}
    </p>
  );
}
