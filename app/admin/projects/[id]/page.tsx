import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProjectEditForm from "@/components/admin/ProjectEditForm";

export default async function ProjectEditPage({ params }: { params: { id: string } }) {
  const [project] = await db.select().from(projects).where(eq(projects.id, Number(params.id)));
  
  if (!project) {
    notFound();
  }

  return <ProjectEditForm project={project} />;
}
