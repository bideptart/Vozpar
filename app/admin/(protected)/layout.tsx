import type { ReactNode } from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { AdminNav } from "@/components/admin/nav"

export default async function AdminLayout({ children }: { children: ReactNode }) {
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
        </aside>

        <div className="flex min-h-dvh flex-col">
          <header className="flex h-16 items-center border-b border-border/60 px-4 lg:hidden">
            <Logo height={24} />
          </header>
          <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
