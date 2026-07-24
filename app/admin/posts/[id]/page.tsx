import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";

export default async function PostEditPage({ params }: { params: { id: string } }) {
  const [post] = await db.select().from(posts).where(eq(posts.id, Number(params.id)));
  
  if (!post) {
    notFound();
  }

  return <PostForm post={post} />;
}
