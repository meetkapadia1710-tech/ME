"use server";

import { headers } from "next/headers";
import * as Sentry from "@sentry/nextjs";
import { Resend } from "resend";

const TO_ADDRESS = "meetkapadia1710@gmail.com";

/**
 * Resend's shared sender works with no domain verification, but can only
 * deliver to the account owner's own address — which is all this form does.
 * Set CONTACT_FROM_EMAIL to an address on a verified domain to change that.
 */
const FROM_ADDRESS =
  process.env.CONTACT_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>";

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5000;

/**
 * In-process rate limit: 3 messages per IP per 10 minutes.
 *
 * Deliberately dependency-free. The tradeoff is that serverless instances each
 * keep their own counter and it resets on cold start, so this raises the cost
 * of casual spam rather than stopping a determined flood. Move to Upstash or
 * Vercel KV if this form ever actually gets abused.
 */
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_KEYS = 1000;
const recentSubmissions = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  // E2E runs submit repeatedly from one IP, and Playwright retries would trip
  // the limiter and change which error the page shows. Same NEXT_PUBLIC_TEST_MODE
  // switch auth.ts and lib/reveal.ts already use. This only skips throttling —
  // it can never turn a failed send into a reported success.
  if (process.env.NEXT_PUBLIC_TEST_MODE === "true") return false;

  const now = Date.now();

  // Bound memory: drop every entry whose window has fully elapsed.
  // forEach rather than for...of — this tsconfig has no `target` set, so
  // downlevelIteration would be required to iterate a Map directly.
  if (recentSubmissions.size > RATE_LIMIT_MAX_KEYS) {
    recentSubmissions.forEach((times, key) => {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        recentSubmissions.delete(key);
      }
    });
  }

  const hits = (recentSubmissions.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (hits.length >= RATE_LIMIT_MAX) {
    recentSubmissions.set(key, hits);
    return true;
  }

  hits.push(now);
  recentSubmissions.set(key, hits);
  return false;
}

function clientKey(): string {
  const forwarded = headers().get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function submitContactForm(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const message = formData.get("message");
  const name = formData.get("name");

  if (!email || !message || !name) {
    return { success: false, error: "Missing required fields" };
  }

  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return { success: false, error: "Invalid email address" };
  }

  if (typeof name !== "string" || typeof message !== "string") {
    return { success: false, error: "Missing required fields" };
  }

  if (name.length > MAX_NAME_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
    return { success: false, error: "Message is too long" };
  }

  if (isRateLimited(clientKey())) {
    return {
      success: false,
      error: "Too many messages sent. Please try again in a few minutes.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Misconfiguration, not a user error — never report success for a send
    // that cannot happen.
    Sentry.captureException(
      new Error("Contact form is misconfigured: RESEND_API_KEY is not set"),
      { tags: { context: "contact-form" } }
    );
    return { success: false, error: "Failed to send message" };
  }

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      // Strip newlines so the submitted name can't restructure the subject.
      subject: `Portfolio contact from ${name.replace(/[\r\n]+/g, " ")}`,
      replyTo: email,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      throw new Error(`Resend rejected the message: ${error.name}`);
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
