"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProjectAction } from "@/app/admin/actions";
import { projects } from "@/db/schema";

export default function NewProjectPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data: typeof projects.$inferInsert = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      tagline: formData.get("tagline") as string || "Default tagline",
      year: formData.get("year") as string || new Date().getFullYear().toString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: (formData.get("type") as any) || "Personal",
      tags: (formData.get("tags") as string)?.split(",").map(t => t.trim()).filter(Boolean) || [],
      overview: formData.get("overview") as string || "Default overview",
      liveUrl: formData.get("liveUrl") as string,
      playgroundType: formData.get("playgroundType") as "none" | "iframe" | "interactive" | "video",
      playgroundUrl: formData.get("playgroundUrl") as string,
      featured: formData.get("featured") === "true",
    };

    const result = await createProjectAction(data);
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
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">New Project</h1>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 md:p-8">
        <form className="space-y-6" onSubmit={onSubmit}>
          {error && <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">{error}</div>}
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input name="name" required type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" placeholder="Project Name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <input name="slug" required type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" placeholder="project-slug" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tagline</label>
              <input name="tagline" type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" placeholder="Short description" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select name="type" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20">
                <option value="Personal">Personal</option>
                <option value="Team">Team</option>
                <option value="Client">Client</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Systems">Systems</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <input name="year" type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" placeholder="2024" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <input name="tags" type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" placeholder="React, Node, etc." />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Overview</label>
            <textarea name="overview" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" rows={4} placeholder="Detailed project overview..."></textarea>
          </div>

          <div className="space-y-2 flex items-center gap-3">
            <input type="checkbox" name="featured" value="true" id="featured" className="h-4 w-4 rounded border-border" />
            <label htmlFor="featured" className="text-sm font-medium">Featured (max 4)</label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Live URL (Archive External Demo)</label>
            <input name="liveUrl" type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" placeholder="https://example.com" />
            <p className="text-xs text-foreground/50">For Tier 2 Archive projects. Rendered as a plain &quot;Live Demo →&quot; link.</p>
          </div>

          <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="font-medium">Playground (Featured Projects)</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select name="playgroundType" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20">
                  <option value="none">None</option>
                  <option value="iframe">Iframe Embed</option>
                  <option value="interactive">Interactive Recreation</option>
                  <option value="video">Video Loop</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Config / URL</label>
                <input name="playgroundUrl" type="text" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" placeholder="Data or URL..." />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <Link href="/admin" className="rounded-md px-4 py-2 text-sm font-medium hover:bg-foreground/5">Cancel</Link>
            <button disabled={loading} type="submit" className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-50">Save Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}
