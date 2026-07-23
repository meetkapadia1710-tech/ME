import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import type { CaseStudyData } from "@/lib/caseStudies";

const data: CaseStudyData = {
  slug: "repograde",
  name: "RepoGrade",
  tagline: "Repository scoring and AI README generation, grounded in real code.",
  role: "Full-Stack",
  year: "2025",
  stack: ["Turborepo", "Next.js", "Gemini", "Postgres"],
  overview:
    "GitHub tool that scores repositories and auto-generates READMEs grounded in the actual codebase, built to serve repo owners, evaluators, recruiters, and orgs alike.",
  approach:
    "A full monorepo serving both halves — repo rating and README auto-generation — as equal hero features, deployable as a web app, a browser extension, or a GitHub Action so it meets each audience where they already work.",
  techStack: [
    {
      name: "Turborepo",
      why: "Monorepo build system tying the web app, extension, and shared packages together.",
    },
    {
      name: "Next.js",
      why: "Powers the web app — server rendering, routing, and the API surface.",
    },
    {
      name: "Plasmo",
      why: "Framework for building the cross-browser extension from the same monorepo.",
    },
    {
      name: "Drizzle + Postgres",
      why: "Type-safe schema and queries over Postgres for repos, scores, and users.",
    },
    {
      name: "Octokit GraphQL",
      why: "Pulls repository data from GitHub's GraphQL API efficiently.",
    },
    {
      name: "Inngest",
      why: "Runs long analysis and generation jobs as durable background workflows.",
    },
    {
      name: "Upstash Redis",
      why: "Serverless Redis for caching and rate-limiting API-heavy operations.",
    },
    {
      name: "Google Gemini",
      why: "The AI backend that scores repositories and drafts READMEs from real code.",
    },
    {
      name: "Auth.js",
      why: "Handles GitHub OAuth and session management.",
    },
    {
      name: "pnpm",
      why: "Fast, disk-efficient package management across the monorepo.",
    },
  ],
  features: [
    "Repository scoring algorithm that rates code quality",
    "AI README generation grounded in the actual codebase",
    "Browser extension for scoring repos in place on GitHub",
    "GitHub Action integration for CI-time checks",
    "Works across four user types — owners, evaluators, recruiters, and orgs",
  ],
  images: {
    hero: "/work/repograde/hero.jpg",
    screenshots: ["/work/repograde/screenshot-1.jpg"],
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

export default function RepoGradeCaseStudy() {
  return <CaseStudy data={data} />;
}
