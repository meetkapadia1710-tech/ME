"use server";

import * as Sentry from "@sentry/nextjs";
import { db } from "@/db";
import { projects, posts } from "@/db/schema";
import { eq, count, and, ne } from "drizzle-orm";

export async function createProjectAction(data: typeof projects.$inferInsert) {
  try {
    if (data.featured) {
      const [res] = await db.select({ value: count() }).from(projects).where(eq(projects.featured, true));
      if (res.value >= 4) {
        return { success: false, error: "Maximum of 4 featured projects allowed. Unfeature another project first." };
      }
    }
    const [result] = await db.insert(projects).values(data).returning();
    return { success: true, project: result };
  } catch (error) {
    Sentry.captureException(error, { tags: { context: "admin-panel", action: "createProject" } });
    return { success: false, error: "Failed to create project" };
  }
}

export async function editProjectAction(id: number, data: Partial<typeof projects.$inferInsert>) {
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
    return { success: true, project: result };
  } catch (error) {
    Sentry.captureException(error, { tags: { context: "admin-panel", action: "editProject" } });
    return { success: false, error: "Failed to edit project" };
  }
}

export async function deleteProjectAction(id: number) {
  try {
    await db.delete(projects).where(eq(projects.id, id));
    return { success: true };
  } catch (error) {
    Sentry.captureException(error, { tags: { context: "admin-panel", action: "deleteProject" } });
    return { success: false, error: "Failed to delete project" };
  }
}

export async function createPostAction(data: typeof posts.$inferInsert) {
  try {
    const [result] = await db.insert(posts).values(data).returning();
    return { success: true, post: result };
  } catch (error) {
    Sentry.captureException(error, { tags: { context: "admin-panel", action: "createPost" } });
    return { success: false, error: "Failed to create post" };
  }
}

export async function editPostAction(id: number, data: Partial<typeof posts.$inferInsert>) {
  try {
    const [result] = await db.update(posts).set(data).where(eq(posts.id, id)).returning();
    return { success: true, post: result };
  } catch (error) {
    Sentry.captureException(error, { tags: { context: "admin-panel", action: "editPost" } });
    return { success: false, error: "Failed to edit post" };
  }
}

export async function togglePostPublishAction(id: number, publish: boolean) {
  try {
    const [result] = await db.update(posts)
      .set({ publishedAt: publish ? new Date() : null })
      .where(eq(posts.id, id))
      .returning();
    return { success: true, post: result };
  } catch (error) {
    Sentry.captureException(error, { tags: { context: "admin-panel", action: "togglePublish" } });
    return { success: false, error: "Failed to toggle publish status" };
  }
}
