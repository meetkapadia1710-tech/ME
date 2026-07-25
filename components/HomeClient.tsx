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
import Footer from "@/components/Footer";
import type { Post } from "@/lib/mdx";
import type { projects } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Project = InferSelectModel<typeof projects>;

export default function HomeClient({ latestPost, dbProjects = [] }: { latestPost: Post | null, dbProjects?: Project[] }) {
  const [loaded, setLoaded] = useState(true);

  return (
    <>
      <Preloader onComplete={() => setLoaded(true)} />
      <Nav />
      <main>
        <Hero loaded={loaded} />
        <CinematicScrub />
        <Intro ready={loaded} />
        <SkillsRadar 
          projects={dbProjects.map(p => ({
            slug: p.slug,
            name: p.name,
            isArchive: p.type !== "Personal" && p.type !== "Client" && p.type !== "Team",
            skillCategories: p.skillCategories || []
          }))} 
        />
        <SelectedWorks ready={loaded} dbProjects={dbProjects} />
        <LatestPost post={latestPost} ready={loaded} />
        <ReachOut ready={loaded} />
      </main>
      <Footer />
    </>
  );
}
