"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { createRevealContext } from "@/lib/reveal";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAdjacent, type CaseStudyData } from "@/lib/caseStudies";
import { getAdjacentArchive } from "@/lib/archiveData";

/** Left-label / right-content section, matching the homepage rhythm. */
function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section
      data-reveal
      className="grid gap-6 border-t border-foreground/10 py-14 md:grid-cols-12 md:gap-10 md:py-20"
    >
      <div className="md:col-span-3">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-foreground/50">
          {label}
        </span>
      </div>
      <div className="md:col-span-9">{children}</div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/40">
        {label}
      </span>
      <span className="font-mono text-sm text-foreground/80">{value}</span>
    </div>
  );
}

export default function CaseStudy({ data, type = "work" }: { data: CaseStudyData; type?: "work" | "archive" }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { prev, next } = type === "work" ? getAdjacent(data.slug) : getAdjacentArchive(data.slug);
  const backLink = type === "work" ? "/#work" : "/archive";

  // Reuse the site's reveal system: each [data-reveal] block fades up as it
  // scrolls into view. No preloader gating here (case pages have none); Lenis
  // + ScrollTrigger come from the root layout's SmoothScroll provider.
  useEffect(() => {
    return createRevealContext(rootRef, () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      items.forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });

      // Gallery screenshots: fade + subtle scale-up on scroll.
      const galleryImgs = gsap.utils.toArray<HTMLElement>("[data-gallery-img]");
      galleryImgs.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          scale: 0.97,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });
    });
  }, [data.slug]);


  return (
    <div ref={rootRef}>
      <Nav />

      <main className="px-6 pt-28 md:px-10 md:pt-32">
        {/* Back to index */}
        <div data-reveal>
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-foreground/60 transition-colors hover:text-foreground"
          >
            <span aria-hidden>←</span> {type === "work" ? "Index" : "Archive"}
          </Link>
        </div>

        {/* Hero */}
        <header
          data-reveal
          className="mt-12 border-b border-foreground/10 pb-12 md:mt-16 md:pb-16"
        >
          <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-foreground md:text-8xl">
            {data.name}
          </h1>
          <p className="mt-6 max-w-2xl font-display text-xl leading-snug text-foreground/70 md:text-2xl">
            {data.tagline}
          </p>
        </header>

        {/* Meta row */}
        <div
          data-reveal
          className="grid grid-cols-2 gap-8 border-b border-foreground/10 py-8 md:grid-cols-4"
        >
          <Meta label="Role" value={data.role} />
          <Meta label="Year" value={data.year} />
          <div className="col-span-2 flex flex-col gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/40">
              Stack
            </span>
            <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-sm text-foreground/80">
              {data.stack.map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden className="text-foreground/25">
                      ·
                    </span>
                  )}
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hero image — only when images are provided */}
        {data.images && (
          <div
            data-reveal
            className="relative mt-10 w-full overflow-hidden rounded-sm md:mt-14"
            style={{ aspectRatio: "16 / 5" }}
          >
            <Image
              src={data.images.hero}
              alt={`${data.name} — hero`}
              fill
              sizes="100vw"
              className="object-cover object-top"
              priority
            />
          </div>
        )}

        {/* Overview */}
        <Section label="Overview">
          <p className="max-w-2xl font-display text-xl leading-relaxed text-foreground/90 md:text-2xl">
            {data.overview}
          </p>
        </Section>

        {/* Approach */}
        {data.approach && (
          <Section label="Approach">
            <p className="max-w-2xl font-display text-xl leading-relaxed text-foreground/90 md:text-2xl">
              {data.approach}
            </p>
          </Section>
        )}

        {/* Tech Stack */}
        {data.techStack && data.techStack.length > 0 && (
          <Section label="Tech Stack">
            <ul className="flex flex-col">
              {data.techStack.map((t, i) => (
                <li
                  key={t.name}
                  className={`grid grid-cols-1 gap-2 py-5 md:grid-cols-12 md:gap-6 ${
                    i > 0 ? "border-t border-foreground/10" : "pt-0"
                  }`}
                >
                  <h3 className="font-display text-lg tracking-tight text-foreground md:col-span-4 md:text-xl">
                    {t.name}
                  </h3>
                  <p className="font-mono text-sm leading-relaxed text-foreground/55 md:col-span-8">
                    {t.why}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Key Features */}
        {data.features && data.features.length > 0 && (
          <Section label="Key Features">
            <ul className="flex flex-col gap-4">
              {data.features.map((f) => (
                <li key={f} className="flex gap-4">
                  <span
                    aria-hidden
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40"
                  />
                  <span className="max-w-2xl font-display text-lg leading-snug text-foreground/85 md:text-xl">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Gallery — only when screenshots are provided */}
        {data.images && data.images.screenshots && data.images.screenshots.length > 0 && (
          <Section label="Gallery">
            <div className={`grid gap-4 md:gap-6 ${data.images.screenshots.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
              {data.images.screenshots.map((src, i) => (
                <div
                  key={src}
                  data-gallery-img
                  className="relative w-full overflow-hidden rounded-sm"
                  style={{ aspectRatio: "16 / 10" }}
                >
                  <Image
                    src={src}
                    alt={`${data.name} — screenshot ${i + 1}`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </Section>
        )}
      </main>

      {/* Prev / Next */}
      <nav className="grid grid-cols-2 border-t border-foreground/10">
        <Link
          href={type === "work" ? `/work/${prev.slug}` : `/archive/${prev.slug}`}
          className="group flex flex-col gap-2 border-r border-foreground/10 px-6 py-10 transition-colors hover:bg-foreground/[0.03] md:px-10 md:py-14"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/40">
            <span aria-hidden className="mr-2 inline-block transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Previous
          </span>
          <span className="font-display text-2xl tracking-tight text-foreground md:text-4xl">
            {prev.name}
          </span>
        </Link>
        <Link
          href={type === "work" ? `/work/${next.slug}` : `/archive/${next.slug}`}
          className="group flex flex-col items-end gap-2 px-6 py-10 text-right transition-colors hover:bg-foreground/[0.03] md:px-10 md:py-14"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/40">
            Next
            <span aria-hidden className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </span>
          <span className="font-display text-2xl tracking-tight text-foreground md:text-4xl">
            {next.name}
          </span>
        </Link>
      </nav>

      <Footer />
    </div>
  );
}

// Re-exported so page files can import the type from one place if preferred.
export type { CaseStudyData };
