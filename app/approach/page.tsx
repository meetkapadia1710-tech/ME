import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ApproachHero from "@/components/ApproachHero";
import JourneyTimeline from "@/components/JourneyTimeline";
import ProcessSteps from "@/components/ProcessSteps";
import CodingProfiles from "@/components/CodingProfiles";
import Certifications from "@/components/Certifications";
import ApproachCTA from "@/components/ApproachCTA";

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
        {/* Proof strip — reusing Phase 11 components, ready={true} bypasses preloader gate */}
        <CodingProfiles ready={true} />
        <Certifications ready={true} />
        <ApproachCTA />
      </main>
      <Footer />
    </>
  );
}
