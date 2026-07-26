import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe half of the auth setup.
 *
 * middleware.ts runs on the Edge runtime, and re-exporting the full `auth` from
 * auth.ts dragged the Credentials provider — and through it `bcryptjs` — into
 * that bundle. The result was a 154 kB middleware executing on every request,
 * plus build warnings about `setImmediate` being unsupported on Edge.
 *
 * This file holds only what the middleware actually needs to decide whether a
 * request may proceed: no providers, no bcrypt, no database. auth.ts spreads
 * this and adds the provider for server-side use.
 */
export const authConfig = {
  secret: process.env.AUTH_SECRET,
  // Providers are added in auth.ts. Middleware only reads the session cookie.
  providers: [],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      if (isOnAdmin && nextUrl.pathname !== "/admin/login") {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn && nextUrl.pathname === "/admin/login") {
        return Response.redirect(new URL("/admin", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
