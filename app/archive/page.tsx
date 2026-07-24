import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Archive from "@/components/Archive";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const PAGE_TITLE = "Archive — Meet Kapadia";
const PAGE_DESCRIPTION =
  "Everything else I've built. An archive of personal projects, team builds, hackathons, and client work.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
  twitter: { title: PAGE_TITLE, description: PAGE_DESCRIPTION },
};

export default async function ArchivePage() {
  const archiveProjects = await db.select().from(projects).where(eq(projects.featured, false)).orderBy(desc(projects.createdAt));

  return (
    <>
      <Nav />
      <main>
        <Archive projectsList={archiveProjects} />
      </main>
      <Footer />
    </>
  );
}
