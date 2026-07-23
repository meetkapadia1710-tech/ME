import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import type { CaseStudyData } from "@/lib/caseStudies";

const data: CaseStudyData = {
  slug: "aure",
  name: "Auré",
  tagline: "Premium loyalty engine and rewards platform for modern brands.",
  role: "Full-Stack",
  year: "2025",
  stack: ["Next.js", "Web3", "Tailwind", "Prisma"],
  overview:
    "A next-generation loyalty rewards platform that replaces punch cards with engaging digital interactions. Brands can quickly spin up custom tiers, rewards, and point economies to increase consumer retention.",
  approach:
    "End-users can scan physical QR codes or complete digital challenges to earn points, which can be redeemed for exclusive drops or higher tier status. The architecture relies on an event-driven system to track loyalty actions accurately.",
  techStack: [
    {
      name: "Next.js",
      why: "React server components for the brand dashboard and consumer portal.",
    },
    {
      name: "Web3 (optional wallet integration)",
      why: "Allows for verifiable digital collectibles as top-tier rewards.",
    },
    {
      name: "Prisma",
      why: "Type-safe database ORM to manage complex point ledgers and reward inventories.",
    },
    {
      name: "Tailwind CSS",
      why: "Highly customizable styling to match each client brand's aesthetic.",
    }
  ],
  features: [
    "Scan-to-earn QR code engine",
    "Dynamic reward tiers (Silver, Gold, Platinum)",
    "Point ledger with fraud detection",
    "Brand-specific white-labeled dashboards"
  ],
  images: {
    hero: "/work/playhub/hero.jpg", // placeholder until Auré images are available
  },
  playgroundType: "interactive",
  playgroundUrl: undefined,
  playgroundConfig: {
    userTier: "Silver",
    points: 1200,
  }
};

const pageTitle = `${data.name} — Case Study — Meet Kapadia`;
export const metadata: Metadata = {
  title: pageTitle,
  description: data.tagline,
  openGraph: {
    title: pageTitle,
    description: data.tagline,
  },
};

export default function AureCaseStudy() {
  return <CaseStudy data={data} />;
}
