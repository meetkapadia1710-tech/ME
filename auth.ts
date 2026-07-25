import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
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
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      if (isOnAdmin && nextUrl.pathname !== '/admin/login') {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn && nextUrl.pathname === '/admin/login') {
        return Response.redirect(new URL('/admin', nextUrl));
      }
      return true;
    },
  },
})
