"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

const NAV = [
  { href: "/features", label: "Features" },
  { href: "/industries", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="absolute inset-x-0 top-0 h-full border-b border-white/40 bg-gradient-to-b from-white/70 via-white/45 to-white/25 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.22)] backdrop-blur-2xl backdrop-saturate-200 dark:border-white/10 dark:from-white/10 dark:via-white/[0.05] dark:to-white/[0.02]" />
      {/* glossy bottom edge highlight */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/20" />
      <div className="relative mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="9278.ai home">
          <Logo height={52} priority />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 rounded-full border border-white/50 bg-gradient-to-b from-white/55 to-white/20 px-2 py-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_8px_24px_-8px_rgba(0,0,0,0.22)] backdrop-blur-2xl backdrop-saturate-200 dark:border-white/15 dark:from-white/10 dark:to-white/[0.04] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] md:flex"
        >
          {NAV.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative rounded-full px-4 py-1.5 text-sm transition-all hover:bg-card/80 hover:text-foreground ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden h-9 sm:inline-flex">
            <a href="https://dashboard.9278.ai/login" target="_blank" rel="noopener noreferrer">
              Sign in
            </a>
          </Button>
          <Button asChild size="sm" className="group btn-ai h-9 rounded-full px-4">
            <Link href="/get-started">
              Get started
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
