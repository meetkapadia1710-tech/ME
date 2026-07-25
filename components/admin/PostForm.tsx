"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPostAction, editPostAction } from "@/app/admin/actions";
import { posts } from "@/db/schema";

export default function PostForm({ post }: { post?: typeof posts.$inferSelect }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEdit = !!post;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data: Partial<typeof posts.$inferInsert> = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      excerpt: formData.get("excerpt") as string,
      body: formData.get("body") as string,
      readingTime: formData.get("readingTime") as string,
      tags: (formData.get("tags") as string)?.split(",").map(t => t.trim()).filter(Boolean) || [],
    };
    
    const action = formData.get("action") as string;
    if (action === "publish") {
        data.publishedAt = new Date();
    } else if (action === "draft" && !post?.publishedAt) {
        data.publishedAt = null;
    }

    const result = isEdit 
        ? await editPostAction(post.id, data)
        : await createPostAction(data as typeof posts.$inferInsert);
        
    if (result && result.success) {
      if (isEdit) {
        router.push("/admin");
      }
    } else if (result && !result.success) {
      setError(result.error || "Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">{isEdit ? `Edit Post: ${post.title}` : 'New Post'}</h1>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 md:p-8">
        <form className="space-y-6" onSubmit={onSubmit}>
          {error && <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">{error}</div>}
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input name="title" defaultValue={post?.title} required type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <input name="slug" defaultValue={post?.slug} required type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reading Time</label>
              <input name="readingTime" defaultValue={post?.readingTime || ""} type="text" placeholder="e.g. 5 min read" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <input name="tags" defaultValue={post?.tags?.join(", ")} type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Excerpt</label>
            <textarea name="excerpt" defaultValue={post?.excerpt} required className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" rows={2}></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Body (Markdown)</label>
            <textarea name="body" defaultValue={post?.body} required className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20 font-mono" rows={12}></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <Link href="/admin" className="rounded-md px-4 py-2 text-sm font-medium hover:bg-foreground/5">Cancel</Link>
            {!post?.publishedAt && (
                <button disabled={loading} type="submit" name="action" value="draft" className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-foreground/5 disabled:opacity-50">Save Draft</button>
            )}
            <button disabled={loading} type="submit" name="action" value={post?.publishedAt ? 'save' : 'publish'} className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-50">
                {post?.publishedAt ? 'Save Changes' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
