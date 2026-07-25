import HomeClient from "@/components/HomeClient";
import { getAllPosts } from "@/lib/mdx";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";

export const revalidate = 60;

export default async function Home() {
  const posts = getAllPosts();
  const latestPost = posts.length > 0 ? posts[0] : null;
  let dbProjects: typeof projects.$inferSelect[] = [];

  try {
    dbProjects = await db.query.projects.findMany({
      orderBy: [desc(projects.createdAt)]
    });
  } catch (error) {
    console.error("Failed to fetch homepage projects:", error);
  }

  return <HomeClient latestPost={latestPost} dbProjects={dbProjects} />;
}
