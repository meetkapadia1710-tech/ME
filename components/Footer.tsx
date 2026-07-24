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
      <footer className="divider-top bg-background px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          {/* Credit + signature lines */}
          <div className="flex flex-col gap-5">
            <p className="font-display text-body-sm text-fg-primary md:text-body">
              Designed &amp; developed by Meet Kapadia
            </p>

            <div className="flex flex-col gap-1.5 font-mono text-meta text-fg-muted">
              <span className="flex w-fit items-center gap-2 text-left">
                Navigate
                <span className="opacity-50">
                  — [⌘K]
                </span>
              </span>
              <span className="flex items-center gap-2">
                Typography
                <span className="opacity-50">— [{TYPEFACE}]</span>
              </span>
            </div>
          </div>

          {/* Socials */}
          <nav className="flex items-center gap-6 font-mono text-meta md:gap-8">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted transition-colors hover:text-fg-primary"
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
        <div className="mt-12 flex items-center justify-between border-t border-fg-primary/10 pt-6 font-mono text-meta text-fg-muted">
          <span>© {new Date().getFullYear()} Meet Kapadia</span>
          <span>Gujarat, IN</span>
        </div>
      </footer>
    </>
  );
}
