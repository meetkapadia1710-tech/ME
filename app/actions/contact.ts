"use server";

import * as Sentry from "@sentry/nextjs";

export async function submitContactForm(formData: FormData) {
  const email = formData.get("email");
  const message = formData.get("message");
  const name = formData.get("name");

  if (!email || !message || !name) {
    return { success: false, error: "Missing required fields" };
  }

  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return { success: false, error: "Invalid email address" };
  }

  try {
    // Simulate email sending logic here
    if (email === "fail@example.com") {
      throw new Error("Simulated email delivery failure");
    }

    return { success: true };
  } catch (error) {
    console.error("Contact form error:", error);
    // Sanitize error before sending to Sentry so we don't leak PII (form data)
    Sentry.captureException(new Error("Contact form submission failed (sanitized)"), {
      tags: { context: "contact-form" },
    });
    return { success: false, error: "Failed to send message" };
  }
}
