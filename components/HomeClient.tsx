"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CinematicScrub from "@/components/CinematicScrub";
import Intro from "@/components/Intro";
import CoreTools from "@/components/CoreTools";
import CodingProfiles from "@/components/CodingProfiles";
import Certifications from "@/components/Certifications";
import SelectedWorks from "@/components/SelectedWorks";
import LatestPost from "@/components/LatestPost";
import ReachOut from "@/components/ReachOut";
import Footer from "@/components/Footer";
import type { Post } from "@/lib/mdx";

export default function HomeClient({ latestPost }: { latestPost: Post | null }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setLoaded(true)} />
      <Nav />
      <main>
        <Hero loaded={loaded} />
        <CinematicScrub />
        <Intro ready={loaded} />
        <CoreTools ready={loaded} />
        <CodingProfiles ready={loaded} />
        <Certifications ready={loaded} />
        <SelectedWorks ready={loaded} />
        <LatestPost post={latestPost} ready={loaded} />
        <ReachOut ready={loaded} />
      </main>
      <Footer />
    </>
  );
}
