"use client";



// Current typeface — swap this if the display font changes (still an open
// decision; must NOT reuse the reference site's licensed TT Hoves).
const TYPEFACE = "Space Grotesk";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/meetkapadia1710-tech" },
  { label: "LinkedIn", href: "https://linkedin.com/in/meet-kapadia17" },
];

export default function Footer() {
  return (
    <>
      <footer className="border-t border-foreground/10 px-6 py-10 md:px-10 md:py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          {/* Credit + signature lines */}
          <div className="flex flex-col gap-5">
            <p className="font-display text-sm text-foreground/80 md:text-base">
              Designed &amp; developed by Meet Kapadia
            </p>

            <div className="flex flex-col gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/40">
              <span className="flex w-fit items-center gap-2 text-left">
                Navigate
                <span className="text-foreground/25">
                  — [⌘K]
                </span>
              </span>
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
