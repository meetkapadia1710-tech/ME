import Link from "next/link"
import { db } from "@/db"
import { projects, posts } from "@/db/schema"
import { desc } from "drizzle-orm"

export default async function AdminDashboard() {
  const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt))
  const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt))

  return (
    <div className="space-y-12">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
          <Link href="/admin/projects/new" className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90">
            New Project
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="p-4 font-medium text-foreground/80">Name</th>
                <th className="p-4 font-medium text-foreground/80">Slug</th>
                <th className="p-4 font-medium text-foreground/80">Type</th>
                <th className="p-4 font-medium text-foreground/80">Featured</th>
                <th className="p-4 text-right font-medium text-foreground/80">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allProjects.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4 text-foreground/60">{p.slug}</td>
                  <td className="p-4 text-foreground/60">{p.type}</td>
                  <td className="p-4">
                    {p.featured ? (
                      <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                        Featured
                      </span>
                    ) : (
                      <span className="text-foreground/40">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/projects/${p.id}`} className="text-blue-500 hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {allProjects.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-foreground/40">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Blog Posts</h2>
          <Link href="/admin/posts/new" className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90">
            New Post
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="p-4 font-medium text-foreground/80">Title</th>
                <th className="p-4 font-medium text-foreground/80">Slug</th>
                <th className="p-4 font-medium text-foreground/80">Status</th>
                <th className="p-4 text-right font-medium text-foreground/80">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allPosts.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="p-4 font-medium">{p.title}</td>
                  <td className="p-4 text-foreground/60">{p.slug}</td>
                  <td className="p-4">
                    {p.publishedAt ? (
                      <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-500">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/posts/${p.id}`} className="text-blue-500 hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {allPosts.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-foreground/40">No posts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
