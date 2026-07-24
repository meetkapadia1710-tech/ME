"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CinematicScrub from "@/components/CinematicScrub";
import Intro from "@/components/Intro";
import SkillsRadar from "@/components/SkillsRadar";
import SelectedWorks from "@/components/SelectedWorks";
import LatestPost from "@/components/LatestPost";
import ReachOut from "@/components/ReachOut";
import { WORKS } from "@/lib/worksData";
import { ARCHIVE_STUDIES } from "@/lib/archiveData";
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
        <SkillsRadar 
          projects={[
            ...WORKS.map(w => ({ slug: w.slug, name: w.name, isArchive: false, skillCategories: w.skillCategories || [] })),
            ...ARCHIVE_STUDIES.map(a => ({ slug: a.slug, name: a.name, isArchive: true, skillCategories: a.skillCategories || [] }))
          ]} 
        />
        <SelectedWorks ready={loaded} />
        <LatestPost post={latestPost} ready={loaded} />
        <ReachOut ready={loaded} />
      </main>
      <Footer />
    </>
  );
}
