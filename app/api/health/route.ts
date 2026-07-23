import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Basic DB connectivity check
    await db.select({ id: projects.id }).from(projects).limit(1);

    return NextResponse.json({
      status: "ok",
      database: "connected",
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || "development",
    });
  } catch (error) {
    console.error("Health check failed:", error);
    Sentry.captureException(error, {
      tags: { context: "health-check" },
    });
    
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
      },
      { status: 503 }
    );
  }
}
