"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { createRevealContext, prefersReducedMotion } from "@/lib/reveal";
import { EASE_ENTRANCE, DUR_STANDARD, REVEAL_Y } from "@/lib/motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAdjacent, type CaseStudyData } from "@/lib/caseStudies";
import PlaygroundRenderer from "@/components/playgrounds/PlaygroundRenderer";

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
      className="grid gap-6 divider-top bg-background py-24 md:grid-cols-12 md:gap-10 md:py-32"
    >
      <div className="md:col-span-3">
        <span className="font-mono text-meta uppercase tracking-[0.15em] text-fg-muted">
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
      <span className="font-mono text-meta uppercase tracking-[0.15em] text-fg-muted">
        {label}
      </span>
      <span className="font-mono text-body-sm text-fg-primary">{value}</span>
    </div>
  );
}

export default function CaseStudy({ data, type = "work", prevProject, nextProject }: { data: CaseStudyData; type?: "work" | "archive", prevProject?: any, nextProject?: any }) {
  const rootRef = useRef<HTMLDivElement>(null);
  
  let prev, next;
  if (type === "work") {
    const adjacent = getAdjacent(data.slug);
    prev = adjacent.prev;
    next = adjacent.next;
  } else {
    prev = prevProject || { slug: "", name: "" };
    next = nextProject || { slug: "", name: "" };
  }

  const backLink = type === "work" ? "/#work" : "/archive";

  // Reuse the site's reveal system: each [data-reveal] block fades up as it
  // scrolls into view. No preloader gating here (case pages have none); Lenis
  // + ScrollTrigger come from the root layout's SmoothScroll provider.
  useEffect(() => {
    return createRevealContext(rootRef, () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      items.forEach((el) => {
        gsap.from(el, {
          y: REVEAL_Y,
          opacity: 0,
          duration: DUR_STANDARD,
          ease: EASE_ENTRANCE,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });

      // Gallery screenshots: clip-path reveal + scrub.
      const galleryImgs = gsap.utils.toArray<HTMLElement>("[data-gallery-img]");
      galleryImgs.forEach((el) => {
        if (prefersReducedMotion()) {
           gsap.set(el, { opacity: 1 });
           return;
        }
        gsap.fromTo(el, 
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", scale: 1.05 },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            scale: 1,
            duration: DUR_STANDARD,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
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
            className="inline-flex items-center gap-2 font-mono text-meta text-fg-muted transition-colors hover:text-fg-primary"
          >
            <span aria-hidden>←</span> {type === "work" ? "Index" : "Archive"}
          </Link>
        </div>

        {/* Hero */}
        <header
          data-reveal
          className="mt-12 border-b border-fg-primary/10 pb-12 md:mt-16 md:pb-16"
        >
          <h1 className="font-display text-display text-fg-primary">
            {data.name}
          </h1>
          <p className="mt-6 max-w-2xl font-display text-heading-sm leading-snug text-fg-muted md:text-heading-md">
            {data.tagline}
          </p>
        </header>

        {/* Meta row */}
        <div
          data-reveal
          className="grid grid-cols-2 gap-8 border-b border-fg-primary/10 py-8 md:grid-cols-4"
        >
          <Meta label="Role" value={data.role} />
          <Meta label="Year" value={data.year} />
          <div className="col-span-2 flex flex-col gap-1.5">
            <span className="font-mono text-meta uppercase tracking-[0.15em] text-fg-muted">
              Stack
            </span>
            <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-body-sm text-fg-primary">
              {data.stack.map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden className="opacity-50">
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
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
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
          <p className="max-w-2xl font-display text-heading-sm leading-relaxed text-fg-primary md:text-heading-md">
            {data.overview}
          </p>
        </Section>

        {/* Approach */}
        {data.approach && (
          <Section label="Approach">
            <p className="max-w-2xl font-display text-heading-sm leading-relaxed text-fg-primary md:text-heading-md">
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
                    i > 0 ? "border-t border-fg-primary/10" : "pt-0"
                  }`}
                >
                  <h3 className="font-display text-heading-sm tracking-tight text-fg-primary md:col-span-4 md:text-heading-md">
                    {t.name}
                  </h3>
                  <p className="font-mono text-body-sm leading-relaxed text-fg-muted md:col-span-8">
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
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fg-muted"
                  />
                  <span className="max-w-2xl font-display text-heading-sm leading-snug text-fg-primary/85 md:text-heading-md">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Gallery — supports both screenshots and videos */}
        {data.images && ((data.images.screenshots && data.images.screenshots.length > 0) || (data.images.videos && data.images.videos.length > 0)) && (
          <Section label="Gallery">
            <div className={`grid gap-6 md:gap-8 ${((data.images.screenshots?.length || 0) + (data.images.videos?.length || 0)) > 1 ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
              {/* Videos first */}
              {data.images.videos?.map((src) => (
                <div
                  key={src}
                  data-gallery-img
                  className="relative w-full overflow-hidden rounded-xl border border-fg-primary/15 bg-background shadow-2xl p-1"
                  style={{ aspectRatio: "16 / 10" }}
                >
                  <video
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
              ))}
              {/* Then screenshots */}
              {data.images.screenshots?.map((src, i) => (
                <div
                  key={src}
                  data-gallery-img
                  className="relative w-full overflow-hidden rounded-xl border border-fg-primary/15 bg-background shadow-2xl p-1"
                  style={{ aspectRatio: "16 / 10" }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-lg">
                    <Image
                      src={src}
                      alt={`${data.name} — screenshot ${i + 1}`}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Playground */}
        {data.playgroundType && data.playgroundType !== "none" && (
          <Section label="Playground">
            <PlaygroundRenderer
              type={data.playgroundType}
              url={data.playgroundUrl}
              config={data.playgroundConfig}
              projectSlug={data.slug}
            />
          </Section>
        )}
      </main>

      {/* Prev / Next */}
      <nav className="grid grid-cols-2 border-t border-fg-primary/10">
        <Link
          href={type === "work" ? `/work/${prev.slug}` : `/archive/${prev.slug}`}
          className="group flex flex-col gap-2 border-r border-fg-primary/10 px-6 py-10 transition-colors hover:bg-fg-primary/[0.03] md:px-10 md:py-14"
        >
          <span className="font-mono text-meta uppercase tracking-[0.15em] text-fg-muted">
            <span aria-hidden className="mr-2 inline-block transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Previous
          </span>
          <span className="font-display text-heading-md tracking-tight text-fg-primary md:text-heading-lg">
            {prev.name}
          </span>
        </Link>
        <Link
          href={type === "work" ? `/work/${next.slug}` : `/archive/${next.slug}`}
          className="group flex flex-col items-end gap-2 px-6 py-10 text-right transition-colors hover:bg-fg-primary/[0.03] md:px-10 md:py-14"
        >
          <span className="font-mono text-meta uppercase tracking-[0.15em] text-fg-muted">
            Next
            <span aria-hidden className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </span>
          <span className="font-display text-heading-md tracking-tight text-fg-primary md:text-heading-lg">
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
