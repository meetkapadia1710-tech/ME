import Link from "next/link"
import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session && process.env.NEXT_PUBLIC_TEST_MODE !== "true") {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-lg font-semibold tracking-tight">
            Portfolio CMS
          </Link>
          <nav className="flex gap-4 text-sm font-medium text-foreground/60">
            <Link href="/admin" className="hover:text-foreground">Dashboard</Link>
            <Link href="/" target="_blank" className="hover:text-foreground">View Site ↗</Link>
          </nav>
        </div>
        <form
          action={async () => {
            "use server"
            await signOut()
          }}
        >
          <button type="submit" className="text-sm font-medium text-foreground/60 hover:text-foreground">
            Sign Out
          </button>
        </form>
      </header>
      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  )
}
