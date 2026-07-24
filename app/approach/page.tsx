import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ApproachHero from "@/components/ApproachHero";
import JourneyTimeline from "@/components/JourneyTimeline";
import ProcessSteps from "@/components/ProcessSteps";
import ApproachCTA from "@/components/ApproachCTA";
import SkillsRadar from "@/components/SkillsRadar";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";

const PAGE_TITLE = "Approach — Meet Kapadia";
const PAGE_DESCRIPTION =
  "How Meet Kapadia builds: scoped tight, shipped in phases, iterated in the open — from interface to backend and deployment.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
  twitter: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
};

export const dynamic = "force-dynamic";

export default async function ApproachPage() {
  const dbProjects = await db.query.projects.findMany({
    orderBy: [desc(projects.createdAt)]
  });
  return (
    <>
      <Nav />
      <main className="px-6 pt-28 md:px-10 md:pt-32">
        <ApproachHero />
        <JourneyTimeline />
        <ProcessSteps />
        {/* Interactive Skills Radar (Replaces flat proof strip) */}
        <SkillsRadar 
          projects={dbProjects.map(p => ({
            slug: p.slug,
            name: p.name,
            isArchive: p.type !== "Personal" && p.type !== "Client" && p.type !== "Team",
            skillCategories: p.skillCategories || []
          }))} 
        />
        <ApproachCTA />
      </main>
      <Footer />
    </>
  );
}
