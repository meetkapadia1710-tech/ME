import HomeClient from "@/components/HomeClient";
import { getAllPosts } from "@/lib/mdx";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = getAllPosts();
  const latestPost = posts.length > 0 ? posts[0] : null;
  const dbProjects = await db.query.projects.findMany({
    orderBy: [desc(projects.createdAt)]
  });

  return <HomeClient latestPost={latestPost} dbProjects={dbProjects} />;
}
