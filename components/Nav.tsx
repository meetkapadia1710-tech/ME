"use client";

import Link from "next/link";

/**
 * Fixed top navigation. Uses `mix-blend-difference` so the white text
 * auto-inverts against whatever section scrolls beneath it (works out of
 * the box once lighter sections land in later phases).
 */
export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <nav className="flex items-center justify-between px-6 py-5 md:px-10 md:py-6">
        <Link
          href="/"
          className="font-display text-sm font-medium uppercase tracking-[0.15em] text-white"
        >
          Meet Kapadia
        </Link>

        <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-[0.15em] text-white md:gap-8">
          <Link href="/" className="transition-opacity hover:opacity-60">
            Index
          </Link>
          <Link href="/approach" className="transition-opacity hover:opacity-60">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
