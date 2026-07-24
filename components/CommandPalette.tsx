"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getLenis } from "@/lib/lenis";

type Item = {
  label: string;
  group: string;
  action: "link" | "scroll" | "external";
  href?: string;
  sectionId?: string;
};

const ITEMS: Item[] = [
  // Sections
  { label: "Intro", group: "Sections", action: "scroll", sectionId: "intro" },
  { label: "Core Tools", group: "Sections", action: "scroll", sectionId: "core-tools" },
  { label: "Selected Works", group: "Sections", action: "scroll", sectionId: "work" },
  { label: "Reach Out", group: "Sections", action: "scroll", sectionId: "reach-out" },
  // Pages
  { label: "Approach", group: "Pages", action: "link", href: "/approach" },
  { label: "Archive", group: "Pages", action: "link", href: "/archive" },
  // Case Studies
  { label: "PlayHub — Case Study", group: "Case Studies", action: "link", href: "/work/playhub" },
  { label: "LocateMe Family — Case Study", group: "Case Studies", action: "link", href: "/work/locateme-family" },
  { label: "RepoGrade — Case Study", group: "Case Studies", action: "link", href: "/work/repograde" },
  // External
  { label: "GitHub ↗", group: "External", action: "external", href: "https://github.com/meetkapadia1710-tech" },
  { label: "LinkedIn ↗", group: "External", action: "external", href: "https://linkedin.com/in/meet-kapadia17" },
  { label: "LeetCode ↗", group: "External", action: "external", href: "https://leetcode.com/Code-Hacker_17" },
];

export function fuzzy(query: string, str: string) {
  const q = query.toLowerCase();
  const s = str.toLowerCase();
  if (!q) return true;
  let qi = 0;
  for (let si = 0; si < s.length && qi < q.length; si++) {
    if (s[si] === q[qi]) qi++;
  }
  return qi === q.length;
}

export default function CommandPalette({
  blogPosts = [],
}: {
  blogPosts?: { title: string; slug: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const allItems = [
    ...ITEMS,
    ...blogPosts.map((post) => ({
      label: `${post.title} — Post`,
      group: "Writing",
      action: "link" as const,
      href: `/blog/${post.slug}`,
    })),
  ];

  const filtered = allItems.filter((item) => fuzzy(query, item.label));

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
    if (prevFocusRef.current) {
      prevFocusRef.current.focus();
      prevFocusRef.current = null;
    }
  }, []);

  const execute = useCallback(
    (item: Item) => {
      close();
      if (item.action === "scroll") {
        const el = document.getElementById(item.sectionId!);
        if (el) {
          const lenis = getLenis();
          if (lenis) {
            lenis.scrollTo(el);
          } else {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      } else if (item.action === "link") {
        router.push(item.href!);
      } else if (item.action === "external") {
        window.open(item.href, "_blank", "noopener,noreferrer");
      }
    },
    [close, router],
  );

  // Keyboard shortcut listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Open: Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => {
          if (!v) {
            prevFocusRef.current = document.activeElement as HTMLElement;
          }
          return !v;
        });
        return;
      }
      if (!open) return;
      
      // Focus trap: prevent tab navigation since arrow keys are used
      if (e.key === "Tab") {
        e.preventDefault();
        return;
      }
      if (e.key === "Escape") { close(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[cursor]) execute(filtered[cursor]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, cursor, filtered, execute]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
      setCursor(0);
    }
  }, [open]);

  if (!open) return null;

  // Group items for display
  const groups = filtered.reduce<Record<string, Item[]>>((acc, item) => {
    (acc[item.group] = acc[item.group] ?? []).push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal
        aria-label="Command palette"
        className="fixed left-1/2 top-[20vh] z-[210] w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-foreground/10 bg-[#0a0a0a] shadow-2xl"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-foreground/10 px-4 py-4">
          <span className="font-mono text-xs text-foreground/40" aria-hidden>⌘</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
            placeholder="Jump to..."
            className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-foreground/30 focus:outline-none"
          />
          <kbd
            onClick={close}
            className="cursor-pointer rounded border border-foreground/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/40 hover:text-foreground/70 transition-colors"
          >
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[55vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center font-mono text-xs text-foreground/30">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            Object.entries(groups).map(([group, items]) => {
              const globalIdx = (item: Item) => filtered.indexOf(item);
              return (
                <div key={group}>
                  <p className="px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/30">
                    {group}
                  </p>
                  {items.map((item) => {
                    const idx = globalIdx(item);
                    const isActive = idx === cursor;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onMouseEnter={() => setCursor(idx)}
                        onClick={() => execute(item)}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 ${
                          isActive
                            ? "bg-foreground/[0.06] text-foreground"
                            : "text-foreground/60 hover:text-foreground"
                        }`}
                      >
                        <span className="font-mono text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-foreground/10 px-4 py-2.5">
          <span className="font-mono text-[10px] text-foreground/25">↑↓ navigate</span>
          <span className="font-mono text-[10px] text-foreground/25">↵ select</span>
          <span className="font-mono text-[10px] text-foreground/25">esc close</span>
        </div>
      </div>
    </>
  );
}
