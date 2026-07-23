import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProjectEditPage({ params }: { params: { id: string } }) {
  // TODO: Fetch project from DB using params.id

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">Edit Project</h1>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 md:p-8">
        <form className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" placeholder="Project Name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <input type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" placeholder="project-slug" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Live URL (Archive External Demo)</label>
            <input type="text" className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" placeholder="https://example.com" />
            <p className="text-xs text-foreground/50">For Tier 2 Archive projects. Rendered as a plain "Live Demo →" link.</p>
          </div>

          <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="font-medium">Playground (Featured Projects)</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20">
                  <option value="none">None</option>
                  <option value="iframe">Iframe Embed</option>
                  <option value="interactive">Interactive Recreation</option>
                  <option value="video">Video Loop</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Config / URL</label>
                <input type="text" className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20" placeholder="Data or URL..." />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <Link href="/admin" className="rounded-md px-4 py-2 text-sm font-medium hover:bg-foreground/5">Cancel</Link>
            <button type="button" className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
