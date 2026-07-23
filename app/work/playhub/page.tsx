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
    "A mobile-first court booking app for Pickleball and Box Cricket, running as a native Android APK and a Progressive Web App. Built with real-time Firebase syncing, it handles end-to-end venue management.",
  approach:
    "Players use a live slot grid powered by Firestore onSnapshot for instant availability, checking out securely via Razorpay server-side verification. Confirmed bookings generate signed Google Wallet passes and update a competitive player leaderboard. Admins manage venues, courts, and bookings through a restricted dashboard.",
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
    "Live slot grid with real-time Firestore onSnapshot updates",
    "Razorpay server-side payment verification via Cloud Functions",
    "Google Wallet passes signed via RS256 JWT for confirmed bookings",
    "Player leaderboard ranked by confirmed booking count",
    "Interactive Leaflet maps for venue navigation",
    "Role-based admin dashboard for venue and booking management",
  ],
  images: {
    hero: "/work/playhub/hero.jpg",
  },
  playgroundType: "interactive",
  playgroundUrl: undefined,
  playgroundConfig: {
    courts: ["Court 1", "Court 2"],
    pricePerSlot: 500,
  }
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
