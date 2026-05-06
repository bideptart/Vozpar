import type { ReactNode } from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { AdminNav } from "@/components/admin/nav"
import { adminSignOut } from "@/app/admin/login/actions"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { requireAdmin } from "@/lib/admin/auth"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin()

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-border/60 bg-card/40 lg:flex lg:flex-col">
          <div className="flex h-16 items-center border-b border-border/60 px-6">
            <Link href="/admin" aria-label="9278.ai super-admin home">
              <Logo height={28} />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <AdminNav />
          </div>
          <div className="border-t border-border/60 px-4 py-4">
            <p className="truncate text-xs text-muted-foreground" title={user.email ?? ""}>
              {user.email}
            </p>
            <form action={adminSignOut} className="mt-2">
              <Button type="submit" variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                <LogOut className="mr-2 h-4 w-4" aria-hidden /> Sign out
              </Button>
            </form>
          </div>
        </aside>

        <div className="flex min-h-dvh flex-col">
          <header className="flex h-16 items-center justify-between border-b border-border/60 px-4 lg:hidden">
            <Logo height={24} />
            <form action={adminSignOut}>
              <Button type="submit" variant="ghost" size="sm">
                <LogOut className="mr-2 h-4 w-4" aria-hidden /> Sign out
              </Button>
            </form>
          </header>
          <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
