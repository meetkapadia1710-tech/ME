import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// Built from the edge-safe config only — importing "@/auth" here would pull
// bcryptjs into the Edge bundle. See auth.config.ts.
export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  // Only the admin area is gated, so only the admin area needs middleware.
  // This previously matched every route except api/_next/static, which meant
  // the auth middleware ran on every public page load for no reason.
  matcher: ['/admin/:path*'],
}
