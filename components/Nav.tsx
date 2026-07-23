"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import Magnetic from "./Magnetic";
import { DUR_FAST, EASE_ENTRANCE } from "@/lib/motion";

/** Shared underline-draw animation — enter draws left→right, leave retracts right→left */
function useUnderline() {
  const lineRef = useRef<HTMLSpanElement>(null);

  const draw = () => {
    if (!lineRef.current) return;
    gsap.to(lineRef.current, {
      scaleX: 1,
      transformOrigin: "left center",
      duration: DUR_FAST * 0.8,
      ease: EASE_ENTRANCE,
    });
  };

  const retract = () => {
    if (!lineRef.current) return;
    gsap.to(lineRef.current, {
      scaleX: 0,
      transformOrigin: "right center",
      duration: DUR_FAST * 0.7,
      ease: "power2.in",
    });
  };

  return { lineRef, draw, retract };
}

function NavLink({
  href,
  children,
  download,
}: {
  href: string;
  children: React.ReactNode;
  download?: boolean;
}) {
  const { lineRef, draw, retract } = useUnderline();
  const isExternal = href.startsWith("http") || download;

  const inner = (
    <span className="relative block py-0.5">
      {children}
      <span
        ref={lineRef}
        aria-hidden
        className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-white"
      />
    </span>
  );

  if (isExternal || download) {
    return (
      <a
        href={href}
        {...(download ? { download: true } : { target: "_blank", rel: "noopener noreferrer" })}
        onMouseEnter={draw}
        onMouseLeave={retract}
        onFocus={draw}
        onBlur={retract}
        className="block text-white transition-opacity"
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onMouseEnter={draw}
      onMouseLeave={retract}
      onFocus={draw}
      onBlur={retract}
      className="block text-white"
    >
      {inner}
    </Link>
  );
}

/**
 * Fixed top navigation.
 * mix-blend-difference keeps the white text auto-inverting.
 * Nav links now share a consistent GSAP underline-draw on hover.
 */
export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <nav className="flex items-center justify-between px-6 py-5 md:px-10 md:py-6">
        <Magnetic>
          <NavLink href="/">Meet Kapadia</NavLink>
        </Magnetic>

        <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-[0.15em] text-white md:gap-8">
          <Magnetic>
            <NavLink href="/">Index</NavLink>
          </Magnetic>
          <Magnetic>
            <NavLink href="/approach">About</NavLink>
          </Magnetic>
          <Magnetic>
            <NavLink href="/blog">Writing</NavLink>
          </Magnetic>
          <Magnetic>
            <NavLink href="/resume.pdf" download>
              CV ↓
            </NavLink>
          </Magnetic>
        </div>
      </nav>
    </header>
  );
}
