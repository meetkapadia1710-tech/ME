import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import type { CaseStudyData } from "@/lib/caseStudies";

const data: CaseStudyData = {
  slug: "aure",
  name: "Auré",
  tagline: "Luxury salon management with a built-in loyalty engine.",
  role: "Design & Development",
  year: "2025",
  stack: ["Vanilla JS", "HTML", "CSS"],
  overview:
    "Luxury salon management application built around a loyalty/rewards engine for repeat clients.",
  approach:
    "Built as a self-contained five-phase build, deliberately kept as a single-file vanilla HTML/JS application — no framework overhead, fully portable, and able to run from one file anywhere.",
  techStack: [
    {
      name: "Vanilla JavaScript",
      why: "All app logic hand-written with zero dependencies, keeping the project lean and fully portable.",
    },
    {
      name: "HTML",
      why: "A single document holds the entire application — structure, views, and templates in one place.",
    },
    {
      name: "CSS",
      why: "Styling co-located in the same file; no build step or preprocessor needed to ship.",
    },
  ],
  features: [
    "Loyalty / rewards engine that tracks and incentivises repeat clients",
    "Salon management workflows for everyday front-desk operations",
    "Single-file architecture — no build step, no dependencies, runs from one file anywhere",
    // TODO(user): add 2–3 more specific features once the exact list is confirmed.
  ],
  images: {
    hero: "/work/aure/hero.jpg",
    screenshots: ["/work/aure/screenshot-1.jpg", "/work/aure/screenshot-2.jpg"],
  },
};

const pageTitle = `${data.name} — Case Study — Meet Kapadia`;
export const metadata: Metadata = {
  title: pageTitle,
  description: data.overview,
  openGraph: { title: pageTitle, description: data.overview },
  twitter: { title: pageTitle, description: data.overview },
};

export default function AureCaseStudy() {
  return <CaseStudy data={data} />;
}
