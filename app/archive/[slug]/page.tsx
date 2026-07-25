import { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/CaseStudy";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { CaseStudyData } from "@/lib/caseStudies";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const [data] = await db.select().from(projects).where(eq(projects.slug, params.slug));
  if (!data) return {};
  return {
    title: `${data.name} | Archive`,
    description: data.overview,
  };
}

export default async function ArchiveCaseStudy({ params }: { params: { slug: string } }) {
  const [dbData] = await db.select().from(projects).where(eq(projects.slug, params.slug));

  if (!dbData) {
    notFound();
  }

  const allProjects = await db.select().from(projects).where(eq(projects.featured, false)).orderBy(desc(projects.createdAt));
  const currentIndex = allProjects.findIndex(p => p.slug === params.slug);
  const prev = allProjects[currentIndex - 1] || allProjects[allProjects.length - 1];
  const next = allProjects[currentIndex + 1] || allProjects[0];

  const mappedData: CaseStudyData = {
    slug: dbData.slug,
    name: dbData.name,
    tagline: dbData.tagline,
    year: dbData.year,
    role: dbData.type,
    stack: dbData.tags,
    overview: dbData.overview,
    approach: dbData.approach || undefined,
    techStack: dbData.techStack || undefined,
    features: dbData.keyFeatures || undefined,
    images: dbData.heroImageUrl ? {
      hero: dbData.heroImageUrl,
      screenshots: undefined,
      videos: undefined
    } : undefined,
    playgroundType: dbData.playgroundType as "none" | "iframe" | "interactive" | "video" | undefined,
    playgroundUrl: dbData.playgroundUrl || undefined,
    playgroundConfig: dbData.playgroundConfig || undefined,
  };

  return <CaseStudy data={mappedData} type="archive" prevProject={prev} nextProject={next} />;
}
