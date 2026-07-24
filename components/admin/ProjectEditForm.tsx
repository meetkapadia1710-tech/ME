"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { editProjectAction } from "@/app/admin/actions";
import { projects } from "@/db/schema";

export default function ProjectEditForm({ project }: { project: typeof projects.$inferSelect }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data: Partial<typeof projects.$inferInsert> = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      tagline: formData.get("tagline") as string,
      year: formData.get("year") as string,
      type: (formData.get("type") as any),
      tags: (formData.get("tags") as string)?.split(",").map(t => t.trim()).filter(Boolean) || [],
      overview: formData.get("overview") as string,
      liveUrl: formData.get("liveUrl") as string,
      playgroundType: formData.get("playgroundType") as "none" | "iframe" | "interactive" | "video",
      playgroundUrl: formData.get("playgroundUrl") as string,
      featured: formData.get("featured") === "true",
    };

    const result = await editProjectAction(project.id, data);
    if (result.success) {
      router.push("/admin");
    } else {
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
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">Edit Project: {project.name}</h1>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 md:p-8">
        <form className="space-y-6" onSubmit={onSubmit}>
          {error && <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">{error}</div>}
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input name="name" defaultValue={project.name} required type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <input name="slug" defaultValue={project.slug} required type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tagline</label>
              <input name="tagline" defaultValue={project.tagline} type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select name="type" defaultValue={project.type} className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20">
                <option value="Personal">Personal</option>
                <option value="Team">Team</option>
                <option value="Client">Client</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Systems">Systems</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <input name="year" defaultValue={project.year} type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <input name="tags" defaultValue={project.tags?.join(", ")} type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Overview</label>
            <textarea name="overview" defaultValue={project.overview} className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" rows={4}></textarea>
          </div>

          <div className="space-y-2 flex items-center gap-3">
            <input type="checkbox" name="featured" value="true" defaultChecked={project.featured} id="featured" className="h-4 w-4 rounded border-border" />
            <label htmlFor="featured" className="text-sm font-medium">Featured (max 4)</label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Live URL (Archive External Demo)</label>
            <input name="liveUrl" defaultValue={project.liveUrl || ""} type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" />
            <p className="text-xs text-foreground/50">For Tier 2 Archive projects. Rendered as a plain &quot;Live Demo →&quot; link.</p>
          </div>

          <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="font-medium">Playground (Featured Projects)</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select name="playgroundType" defaultValue={project.playgroundType || "none"} className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20">
                  <option value="none">None</option>
                  <option value="iframe">Iframe Embed</option>
                  <option value="interactive">Interactive Recreation</option>
                  <option value="video">Video Loop</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Config / URL</label>
                <input name="playgroundUrl" defaultValue={project.playgroundUrl || ""} type="text" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <Link href="/admin" className="rounded-md px-4 py-2 text-sm font-medium hover:bg-foreground/5">Cancel</Link>
            <button disabled={loading} type="submit" className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-50">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
