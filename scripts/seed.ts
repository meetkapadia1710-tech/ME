import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../db";
import { projects } from "../db/schema";
import { ARCHIVE_STUDIES } from "../lib/archiveData";

const FEATURED_PROJECTS = [
  {
    slug: "playhub",
    name: "PlayHub",
    tagline: "Cross-platform turf booking for cricket and pickleball, built end to end.",
    year: "2025",
    type: "Personal",
    tags: ["React 19", "Capacitor", "Firebase", "Razorpay"],
    skillCategories: ["Frontend", "Mobile", "Backend"],
    featured: true,
    thumbnailUrl: "/work/playhub/thumbnail.jpg",
    heroImageUrl: "/work/playhub/hero.jpg",
    overview: "A mobile-first court booking app for Pickleball and Box Cricket, running as a native Android APK and a Progressive Web App. Built with real-time Firebase syncing, it handles end-to-end venue management.",
    approach: "Players use a live slot grid powered by Firestore onSnapshot for instant availability, checking out securely via Razorpay server-side verification. Confirmed bookings generate signed Google Wallet passes and update a competitive player leaderboard. Admins manage venues, courts, and bookings through a restricted dashboard.",
    techStack: [
      { name: "React 19", why: "Component-driven UI shared across the customer, owner, and admin experiences." },
      { name: "Capacitor (Android)", why: "Wraps the React web app into a native Android build from a single codebase." },
      { name: "Firebase Cloud Functions", why: "Server-side booking logic, availability checks, and secure integrations run as managed functions." },
      { name: "Razorpay", why: "Collects and settles real-money court payments for an Indian audience." },
      { name: "Google Wallet", why: "Issues signed digital passes so confirmed bookings live in the user's wallet." },
      { name: "FCM", why: "Delivers booking confirmations and reminders straight to the device." },
      { name: "Leaflet", why: "Interactive maps for locating and previewing the three venues." }
    ],
    keyFeatures: [
      "Live slot grid with real-time Firestore onSnapshot updates",
      "Razorpay server-side payment verification via Cloud Functions",
      "Google Wallet passes signed via RS256 JWT for confirmed bookings",
      "Player leaderboard ranked by confirmed booking count",
      "Interactive Leaflet maps for venue navigation",
      "Role-based admin dashboard for venue and booking management"
    ],
    playgroundType: "interactive",
    playgroundUrl: null,
    playgroundConfig: {
      courts: ["Court 1", "Court 2"],
      pricePerSlot: 500,
    }
  },
  {
    slug: "locateme-family",
    name: "LocateMe Family",
    tagline: "Consent-first family location sharing for Android.",
    year: "2025",
    type: "Personal",
    tags: ["Android", "Kotlin"],
    skillCategories: ["Mobile", "Systems"],
    featured: true,
    thumbnailUrl: "/work/locateme-family/thumbnail.jpg",
    heroImageUrl: "/work/locateme-family/hero.jpg",
    overview: "Consent-first family location-sharing app for Android, built around explicit permission rather than passive tracking.",
    approach: "Location sharing is strictly opt-in: a family member explicitly grants access before their position is ever visible to anyone else, and can review or revoke that access at any time. Rather than running as always-on background tracking, the app frames sharing as a consent handshake between members.",
    techStack: [
      { name: "Kotlin (Android)", why: "Native Android application written in Kotlin." }
    ],
    keyFeatures: [
      "Explicit, opt-in consent before any location is shared",
      "Access can be reviewed and revoked at any time"
    ],
    playgroundType: "interactive",
    playgroundUrl: null,
    playgroundConfig: null,
    liveUrl: null,
  },
  {
    slug: "repograde",
    name: "RepoGrade",
    tagline: "Repository scoring and AI README generation, grounded in real code.",
    year: "2025",
    type: "Personal",
    tags: ["Turborepo", "Next.js", "Gemini", "Postgres"],
    skillCategories: ["Frontend", "Backend", "Systems", "AI/Tooling"],
    featured: true,
    thumbnailUrl: "/work/repograde/thumbnail.jpg",
    heroImageUrl: "/work/repograde/hero.jpg",
    overview: "GitHub tool that scores repositories and auto-generates READMEs grounded in the actual codebase, built to serve repo owners, evaluators, recruiters, and orgs alike.",
    approach: "A full monorepo serving both halves — repo rating and README auto-generation — as equal hero features, deployable as a web app, a browser extension, or a GitHub Action so it meets each audience where they already work.",
    techStack: [
      { name: "Turborepo", why: "Monorepo build system tying the web app, extension, and shared packages together." },
      { name: "Next.js", why: "Powers the web app — server rendering, routing, and the API surface." },
      { name: "Plasmo", why: "Framework for building the cross-browser extension from the same monorepo." },
      { name: "Drizzle + Postgres", why: "Type-safe schema and queries over Postgres for repos, scores, and users." },
      { name: "Octokit GraphQL", why: "Pulls repository data from GitHub's GraphQL API efficiently." },
      { name: "Inngest", why: "Runs long analysis and generation jobs as durable background workflows." },
      { name: "Upstash Redis", why: "Serverless Redis for caching and rate-limiting API-heavy operations." },
      { name: "Google Gemini", why: "The AI backend that scores repositories and drafts READMEs from real code." },
      { name: "Auth.js", why: "Handles GitHub OAuth and session management." },
      { name: "pnpm", why: "Fast, disk-efficient package management across the monorepo." }
    ],
    keyFeatures: [
      "Repository scoring algorithm that rates code quality",
      "AI README generation grounded in the actual codebase",
      "Chrome/Firefox extension for in-context analysis on GitHub",
      "GitHub Action for automated PR reviews",
      "Serverless background processing for large repositories"
    ],
    playgroundType: "interactive",
    playgroundUrl: null,
    playgroundConfig: null,
    liveUrl: "https://repograde.dev",
  },

];

function mapRoleToType(role: string): string {
  const valid = ["Personal", "Team", "Client", "Hackathon", "Systems"];
  return valid.includes(role) ? role : "Personal";
}

async function main() {
  console.log("Seeding Database...");

  // Seed Projects
  for (const p of FEATURED_PROJECTS) {
    await db.insert(projects).values({
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      year: p.year,
      type: p.type as any,
      tags: p.tags,
      featured: p.featured,
      thumbnailUrl: p.thumbnailUrl,
      heroImageUrl: p.heroImageUrl,
      overview: p.overview,
      approach: p.approach,
      skillCategories: (p as any).skillCategories || null,
      techStack: p.techStack,
      keyFeatures: p.keyFeatures,
      playgroundType: p.playgroundType as any || "none",
      playgroundUrl: p.playgroundUrl || null,
      playgroundConfig: p.playgroundConfig || null,
    }).onConflictDoNothing();
    console.log(`Seeded Featured Project: ${p.name}`);
  }

  for (const a of ARCHIVE_STUDIES) {
    await db.insert(projects).values({
      slug: a.slug,
      name: a.name,
      tagline: a.tagline || "",
      year: a.year || "2024",
      type: mapRoleToType(a.role) as any,
      tags: a.stack,
      featured: false,
      heroImageUrl: a.images?.hero || null,
      overview: a.overview,
      approach: a.approach || null,
      skillCategories: (a as any).skillCategories || null,
      techStack: a.techStack || null,
      keyFeatures: a.features || null,
    }).onConflictDoNothing();
    console.log(`Seeded Archive Project: ${a.name}`);
  }

  // Posts are not seeded: they live as MDX in content/posts and are read from
  // disk by lib/mdx.ts. See db/schema.ts.

  console.log("Done seeding!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to seed", err);
  process.exit(1);
});
