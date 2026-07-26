import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

// Full config: auth.config.ts plus the Credentials provider. This module pulls
// in bcryptjs, so it must never be imported from middleware.ts — see the note
// in auth.config.ts.
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const password = credentials?.password as string | undefined;
        if (!password) return null;

        const hash = process.env.ADMIN_PASSWORD_HASH;
        const plainPassword = process.env.ADMIN_PASSWORD;

        if (hash) {
          const isValid = await bcrypt.compare(password, hash);
          if (isValid) {
            return { id: "1", name: "Admin", email: "admin@portfolio.local" };
          }
        } else if (plainPassword && (process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_TEST_MODE === "true")) {
          if (password === plainPassword) {
            return { id: "1", name: "Admin", email: "admin@portfolio.local" };
          }
        }
        return null;
      }
    })
  ],
})
