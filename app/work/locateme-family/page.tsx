import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import type { CaseStudyData } from "@/lib/caseStudies";

// NOTE: Several fields below are provisional and marked with [brackets] —
// they need confirmation of the real implementation details.
const data: CaseStudyData = {
  slug: "locateme-family",
  name: "LocateMe Family",
  tagline: "Consent-first family location sharing for Android.",
  role: "Android Development",
  year: "2025",
  stack: ["Android", "Kotlin"],
  overview:
    "Consent-first family location-sharing app for Android, built around explicit permission rather than passive tracking.",
  approach:
    "Location sharing is strictly opt-in: a family member explicitly grants access before their position is ever visible to anyone else, and can review or revoke that access at any time. Rather than running as always-on background tracking, the app frames sharing as a consent handshake between members — you choose who sees you, and when. [Provisional — confirm the real core screens, the exact permission flow, and what makes it consent-first in practice.]",
  techStack: [
    {
      name: "Kotlin (Android)",
      why: "Native Android application written in Kotlin.",
    },
  ],
  features: [
    "Explicit, opt-in consent before any location is shared",
    "Access can be reviewed and revoked at any time",
    "[Additional features to confirm]",
  ],
  images: {
    hero: "/work/locateme-family/hero.jpg",
    screenshots: [
      "/work/locateme-family/screenshot-1.jpg",
      "/work/locateme-family/screenshot-2.jpg",
    ],
  },
  playgroundType: "interactive",
};

const pageTitle = `${data.name} — Case Study — Meet Kapadia`;
export const metadata: Metadata = {
  title: pageTitle,
  description: data.overview,
  openGraph: { title: pageTitle, description: data.overview },
  twitter: { title: pageTitle, description: data.overview },
};

export default function LocateMeCaseStudy() {
  return <CaseStudy data={data} />;
}
