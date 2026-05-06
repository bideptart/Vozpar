"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Receipt, PhoneCall, BarChart3, Activity, Search } from "lucide-react"

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: Receipt },
  { href: "/admin/phone-numbers", label: "Phone numbers", icon: PhoneCall },
  { href: "/admin/plans", label: "Plan distribution", icon: BarChart3 },
  { href: "/admin/traffic", label: "Traffic", icon: Activity },
  { href: "/admin/seo", label: "SEO audit", icon: Search },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-accent/15 text-foreground"
                : "text-muted-foreground hover:bg-card hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
