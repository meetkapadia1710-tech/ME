import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ApproachHero from "@/components/ApproachHero";
import JourneyTimeline from "@/components/JourneyTimeline";
import ProcessSteps from "@/components/ProcessSteps";
import ApproachCTA from "@/components/ApproachCTA";
import SkillsRadar from "@/components/SkillsRadar";
import { WORKS } from "@/lib/worksData";
import { ARCHIVE_STUDIES } from "@/lib/archiveData";

const PAGE_TITLE = "Approach — Meet Kapadia";
const PAGE_DESCRIPTION =
  "How Meet Kapadia builds: scoped tight, shipped in phases, iterated in the open — from interface to backend and deployment.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
  twitter: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
};

export default function ApproachPage() {
  return (
    <>
      <Nav />
      <main className="px-6 pt-28 md:px-10 md:pt-32">
        <ApproachHero />
        <JourneyTimeline />
        <ProcessSteps />
        {/* Interactive Skills Radar (Replaces flat proof strip) */}
        <SkillsRadar 
          projects={[
            ...WORKS.map(w => ({ slug: w.slug, name: w.name, isArchive: false, skillCategories: w.skillCategories || [] })),
            ...ARCHIVE_STUDIES.map(a => ({ slug: a.slug, name: a.name, isArchive: true, skillCategories: (a as any).skillCategories || [] }))
          ]} 
        />
        <ApproachCTA />
      </main>
      <Footer />
    </>
  );
}
