"use server";

import * as Sentry from "@sentry/nextjs";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, count, and, ne } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * Flush the cached public pages that render project data.
 *
 * `/archive` and `/work/[slug]` are prerendered at build time, so without this
 * an admin edit never reaches the site until the next deploy. `/` has a 60s
 * revalidate of its own but is included so edits show up immediately.
 *
 * Must be called BEFORE `redirect()` — redirect throws internally, so anything
 * after it is unreachable.
 */
function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath("/archive/[slug]", "page");
  revalidatePath("/work/[slug]", "page");
}

export async function createProjectAction(data: typeof projects.$inferInsert) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  let success = false;
  try {
    if (data.featured) {
      const [res] = await db.select({ value: count() }).from(projects).where(eq(projects.featured, true));
      if (res.value >= 4) {
        return { success: false, error: "Maximum of 4 featured projects allowed. Unfeature another project first." };
      }
    }
    await db.insert(projects).values(data);
    success = true;
  } catch (error) {
    Sentry.captureException(error, { tags: { context: "admin-panel", action: "createProject" } });
    return { success: false, error: "Failed to create project" };
  }
  if (success) {
    revalidatePublicPages();
    redirect("/admin");
  }
}

export async function editProjectAction(id: number, data: Partial<typeof projects.$inferInsert>) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    if (data.featured) {
      const [res] = await db.select({ value: count() }).from(projects).where(
        and(eq(projects.featured, true), ne(projects.id, id))
      );
      if (res.value >= 4) {
        return { success: false, error: "Maximum of 4 featured projects allowed. Unfeature another project first." };
      }
    }
    const [result] = await db.update(projects).set(data).where(eq(projects.id, id)).returning();
    revalidatePublicPages();
    return { success: true, project: result };
  } catch (error) {
    Sentry.captureException(error, { tags: { context: "admin-panel", action: "editProject" } });
    return { success: false, error: "Failed to edit project" };
  }
}

export async function deleteProjectAction(id: number) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePublicPages();
    return { success: true };
  } catch (error) {
    Sentry.captureException(error, { tags: { context: "admin-panel", action: "deleteProject" } });
    return { success: false, error: "Failed to delete project" };
  }
}

// Post CRUD actions used to live here. Blog posts are MDX files in
// content/posts — see db/schema.ts for why the table went away.
