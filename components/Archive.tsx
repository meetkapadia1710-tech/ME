"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { createRevealContext, prefersReducedMotion } from "@/lib/reveal";

type Project = {
  name: string;
  repo: string;
  type: string;
  desc: string;
};

const PROJECTS: Project[] = [
  { name: "Hindsight", repo: "meetkapadia1710-tech/hindsight", type: "Hackathon", desc: "On-device 'photographic memory' for your PC — captures activity locally and answers questions about your past, built for the Supermemory hackathon." },
  { name: "BD Buildcon", repo: "meetkapadia1710-tech/BD_Buildcon", type: "Client", desc: "Production Next.js marketing site for an industrial EPC contractor — project galleries, machinery inventory, and animated content sections." },
  { name: "J.A.R.V.I.S", repo: "meetkapadia1710-tech/J.A.R.V.I.S", type: "Personal", desc: "Offline, voice-controlled AI assistant for Windows — wake-word activation, 20+ tools, semantic memory, and a live dashboard." },
  { name: "Saloon-Management", repo: "meetkapadia1710-tech/Saloon-Management", type: "Personal", desc: "Description coming soon." },
  { name: "Attendance-Manager", repo: "meetkapadia1710-tech/Attendance-Manager", type: "Client", desc: "Real-time staff attendance and payroll tracker for a beauty salon — Firestore sync, CSV export, admin-gated access." },
  { name: "MeetOS", repo: "meetkapadia1710-tech/Meet-Portfoilio", type: "Personal", desc: "Pixel-accurate macOS Sequoia desktop, rebuilt as a portfolio — windowed apps, a Gemini AI assistant, multi-language support." },
  { name: "LearnFlex", repo: "DhirGoplani/Learn_Flex", type: "Team", desc: "Online exam-prep quiz platform, DBMS course project." },
  { name: "WealthNest", repo: "Mrugen123/wealthnest", type: "Team", desc: "Django personal finance app — dashboard, budgets, goals, PDF reports." },
  { name: "Money-Mint", repo: "HITMAN5050/Money-mint", type: "Personal", desc: "Personal finance tracker." },
  { name: "Resume Portfolio", repo: "meetkapadia1710-tech/miniResume", type: "Personal", desc: "Bento-grid resume site with a live GitHub contribution heatmap and streak tracking." },
  { name: "Engram", repo: "meetkapadia1710-tech/Engram", type: "Personal", desc: "Self-hostable memory platform for AI agents — semantic search, knowledge graphs, and multi-agent orchestration built on Supermemory." },
  { name: "Air_BnB", repo: "meetkapadia1710-tech/Air_BnB", type: "Personal", desc: "Description coming soon." },
  { name: "AI_Detector", repo: "meetkapadia1710-tech/AI_Detector", type: "Personal", desc: "Fine-tuned DeBERTa-v3 model detecting AI-generated text at 99.77% accuracy, open-sourced with transparent benchmarks." },
  { name: "ReFractor.ai", repo: "meetkapadia1710-tech/ReFractor.ai", type: "Personal", desc: "Description coming soon." },
  { name: "ChaT", repo: "meetkapadia1710-tech/ChaT", type: "Personal", desc: "Description coming soon." },
  { name: "PayMatrix", repo: "Marshmellow31/PayMatrix", type: "Team", desc: "Description coming soon." },
  { name: "Nexus", repo: "Marshmellow31/Nexus", type: "Team", desc: "Description coming soon." },
  { name: "DBMS_Project", repo: "mayanksoni78/DBMS_Project", type: "Team", desc: "Description coming soon." },
  { name: "transitops", repo: "krishnayadav9793/transitops", type: "Team", desc: "Description coming soon." },
  { name: "ai-triage-ambulance-hackathon", repo: "Deep084-bot/ai-triage-ambulance-hackathon", type: "Hackathon", desc: "Description coming soon." },
  { name: "HackoutDAIICT", repo: "meetkapadia1710-tech/HackoutDAIICT", type: "Hackathon", desc: "Description coming soon." },
  { name: "DealAI Agent", repo: "meetkapadia1710-tech/deal-intelligence-agent", type: "Hackathon", desc: "AI sales assistant that remembers every call — synthesizes meetings and surfaces context-grounded next steps, built for HackBaroda." },
];

export default function Archive() {
  const rootRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const canHover = useRef(false);
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    canHover.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !prefersReducedMotion();

    return createRevealContext(rootRef, () => {
      // Floating preview — starts hidden, follows cursor via quickTo lerp.
      if (previewRef.current) {
        gsap.set(previewRef.current, {
          autoAlpha: 0,
          scale: 0.85,
          xPercent: -50,
          yPercent: -50,
        });
        xTo.current = gsap.quickTo(previewRef.current, "x", {
          duration: 0.55,
          ease: "power3",
        });
        yTo.current = gsap.quickTo(previewRef.current, "y", {
          duration: 0.55,
          ease: "power3",
        });
      }

      const items = gsap.utils.toArray<HTMLElement>("[data-reveal-row]");
      gsap.from(items, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 85%",
          once: true,
        },
      });
    });
  }, []);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!canHover.current) return;
    xTo.current?.(e.clientX);
    yTo.current?.(e.clientY);
  }, []);

  const showPreview = useCallback((i: number) => {
    if (!canHover.current || !previewRef.current) return;
    gsap.to(previewRef.current, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.4,
      ease: "power3.out",
    });
    cardsRef.current.forEach((card, idx) => {
      if (card) {
        gsap.to(card, {
          opacity: idx === i ? 1 : 0,
          duration: 0.25,
          ease: "power2.out",
        });
      }
    });
  }, []);

  const hidePreview = useCallback(() => {
    if (!previewRef.current) return;
    gsap.to(previewRef.current, {
      autoAlpha: 0,
      scale: 0.85,
      duration: 0.3,
      ease: "power3.out",
    });
  }, []);

  return (
    <div ref={rootRef} onMouseMove={handleMove} className="relative px-6 pt-28 pb-24 md:px-10 md:pt-32 md:pb-32">
      {/* Header */}
      <div data-reveal-row>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-foreground/60 transition-colors hover:text-foreground"
        >
          <span aria-hidden>←</span> Index
        </Link>
      </div>

      <header data-reveal-row className="mt-12 border-b border-foreground/10 pb-12 md:mt-16 md:pb-16">
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-foreground md:text-8xl">
          Archive.
        </h1>
        <p className="mt-6 max-w-2xl font-display text-xl leading-snug text-foreground/70 md:text-2xl">
          Everything else I&apos;ve built.
        </p>
      </header>

      {/* Flat List */}
      <ul className="group/list mt-12 md:mt-16">
        {PROJECTS.map((p, i) => (
          <li key={p.repo} data-reveal-row>
            <a
              href={`https://github.com/${p.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => showPreview(i)}
              onMouseLeave={hidePreview}
              className="group flex flex-col gap-3 border-b border-foreground/10 py-6 opacity-100 transition-opacity duration-300 first:border-t hover:!opacity-100 group-hover/list:opacity-40 md:flex-row md:items-start md:gap-8 md:py-8"
            >
              <div className="md:w-1/4">
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/50">
                  {p.type}
                </span>
                <h3 className="mt-1 font-display text-2xl tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-2">
                  {p.name}
                </h3>
              </div>

              <div className="flex flex-col items-start justify-between gap-4 md:w-3/4 md:flex-row md:items-center">
                <p className="font-mono text-sm leading-relaxed text-foreground/60 transition-colors group-hover:text-foreground/80 md:max-w-xl">
                  {p.desc}
                </p>

                <span className="inline-flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-foreground/40 transition-colors group-hover:text-foreground">
                  GitHub{" "}
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {/* ── Desktop cursor-follow floating preview (fine-pointer only) ── */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[320px] w-[260px] overflow-hidden rounded-xl bg-[#0a0a0a] md:block border border-foreground/10"
        style={{ willChange: "transform" }}
      >
        {/* CSS Grid Overlay (replicates the AI-generated placeholder look) */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.04]" 
          style={{ 
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', 
            backgroundSize: '2rem 2rem',
            backgroundPosition: 'center center'
          }}
        ></div>

        {PROJECTS.map((p, i) => (
          <div
            key={p.repo}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center opacity-0"
          >
            <span className="px-6 text-center font-display text-2xl tracking-tight text-foreground/90">
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
