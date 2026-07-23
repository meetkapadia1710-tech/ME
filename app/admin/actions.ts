"use server";

import * as Sentry from "@sentry/nextjs";

/**
 * Example wrapper for admin actions to capture errors without exposing PII.
 * In a real application, you'll wrap your actual Drizzle operations here.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createProjectAction(_formData: FormData) {
  try {
    // 1. Validate auth & input
    // 2. Insert into DB
    // 3. Revalidate path
    
    // Simulate error for demonstration/setup verification
    // throw new Error("Database insertion failed");

    return { success: true };
  } catch (error) {
    console.error("Failed to create project:", error);
    
    // Capture to Sentry with context, avoiding sending the raw FormData (PII)
    Sentry.captureException(error, {
      tags: { 
        context: "admin-panel",
        action: "createProject" 
      },
    });

    return { success: false, error: "Failed to create project" };
  }
}
