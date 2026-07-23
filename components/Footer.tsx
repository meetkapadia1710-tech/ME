"use client";

import { useEffect, useState } from "react";

// Current typeface — swap this if the display font changes (still an open
// decision; must NOT reuse the reference site's licensed TT Hoves).
const TYPEFACE = "Space Grotesk";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/meetkapadia1710-tech" },
  { label: "LinkedIn", href: "https://linkedin.com/in/meet-kapadia17" },
];

/**
 * Low-opacity 12-column grid overlay, toggled by Shift+G (or clicking the
 * footer label). Fixed across the viewport, non-interactive.
 */
function GridOverlay({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[90] transition-opacity duration-500 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mx-auto grid h-full grid-cols-12 gap-4 px-6 md:gap-6 md:px-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-full border-x border-foreground/[0.06] bg-foreground/[0.04]"
          />
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const [gridOn, setGridOn] = useState(false);

  // Shift+G toggles the column grid — a real, working shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable)
      ) {
        return;
      }
      if (e.shiftKey && e.key.toLowerCase() === "g") {
        e.preventDefault();
        setGridOn((on) => !on);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <GridOverlay active={gridOn} />

      <footer className="border-t border-foreground/10 px-6 py-10 md:px-10 md:py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          {/* Credit + signature lines */}
          <div className="flex flex-col gap-5">
            <p className="font-display text-sm text-foreground/80 md:text-base">
              Designed &amp; developed by Meet Kapadia
            </p>

            <div className="flex flex-col gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/40">
              <button
                type="button"
                onClick={() => setGridOn((on) => !on)}
                aria-pressed={gridOn}
                className="group flex w-fit items-center gap-2 text-left transition-colors hover:text-foreground/70"
              >
                Grid UI
                <span className="text-foreground/25 transition-colors group-hover:text-foreground/50">
                  — [Shift + G]
                </span>
              </button>
              <span className="flex items-center gap-2">
                Typography
                <span className="text-foreground/25">— [{TYPEFACE}]</span>
              </span>
            </div>
          </div>

          {/* Socials */}
          <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-[0.15em] md:gap-8">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 transition-colors hover:text-foreground"
              >
                {s.label}
                <span aria-hidden className="ml-1 inline-block">
                  ↗
                </span>
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom line */}
        <div className="mt-12 flex items-center justify-between border-t border-foreground/10 pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/30">
          <span>© {new Date().getFullYear()} Meet Kapadia</span>
          <span>Gujarat, IN</span>
        </div>
      </footer>
    </>
  );
}
