import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import type { CaseStudyData } from "@/lib/caseStudies";

const data: CaseStudyData = {
  slug: "playhub",
  name: "PlayHub",
  tagline: "Cross-platform turf booking for cricket and pickleball, built end to end.",
  role: "Full-Stack & Mobile",
  year: "2025",
  stack: ["React 19", "Capacitor", "Firebase", "Razorpay"],
  overview:
    "Cross-platform turf booking app for cricket and pickleball courts, covering three venues with full role-based access.",
  approach:
    "Role-based navigation across customers, court owners, and admins — a booking flow for players, owner dashboards for managing courts and availability, admin panels for oversight, real-money payments, and digital wallet passes for confirmed bookings.",
  techStack: [
    {
      name: "React 19",
      why: "Component-driven UI shared across the customer, owner, and admin experiences.",
    },
    {
      name: "Capacitor (Android)",
      why: "Wraps the React web app into a native Android build from a single codebase.",
    },
    {
      name: "Firebase Cloud Functions",
      why: "Server-side booking logic, availability checks, and secure integrations run as managed functions.",
    },
    {
      name: "Razorpay",
      why: "Collects and settles real-money court payments for an Indian audience.",
    },
    {
      name: "Google Wallet (RS256 JWT passes)",
      why: "Issues signed digital passes so confirmed bookings live in the user's wallet.",
    },
    {
      name: "FCM (push notifications)",
      why: "Delivers booking confirmations and reminders straight to the device.",
    },
    {
      name: "Leaflet (maps)",
      why: "Interactive maps for locating and previewing the three venues.",
    },
  ],
  features: [
    "Real-time court booking across three venues",
    "Razorpay payment integration for real-money transactions",
    "Google Wallet passes for confirmed bookings",
    "Push notifications for confirmations and reminders",
    "Role-based dashboards for three user types — players, owners, and admins",
  ],
  images: {
    hero: "/work/playhub/hero.jpg",
    screenshots: ["/work/playhub/screenshot-1.jpg", "/work/playhub/screenshot-2.jpg"],
  },
};

const pageTitle = `${data.name} — Case Study — Meet Kapadia`;
export const metadata: Metadata = {
  title: pageTitle,
  description: data.overview,
  openGraph: { title: pageTitle, description: data.overview },
  twitter: { title: pageTitle, description: data.overview },
};

export default function PlayHubCaseStudy() {
  return <CaseStudy data={data} />;
}
