"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Menu, X, AudioLines, Building2, HelpCircle, Tag } from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { Logo } from "@/components/logo"

const NAV = [
  { href: "/features",   label: "Features",   icon: AudioLines },
  { href: "/industries", label: "Industries", icon: Building2  },
  { href: "/pricing",    label: "Pricing",    icon: Tag        },
  { href: "/faq",        label: "FAQ",        icon: HelpCircle },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        {/* Backdrop */}
        <div className="absolute inset-0 border-b border-white/[0.07] bg-black/75 backdrop-blur-xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

        <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6">

          {/* Logo */}
          <Link href="/" aria-label="Vozpar home"
            className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1] focus-visible:rounded-sm">
            <Logo height={32} priority />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link key={item.href} href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1] ${
                    isActive ? "text-white" : "text-white/50 hover:text-white/85"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://voice.Vozpar/" target="_blank" rel="noopener noreferrer"
              className="hidden h-9 items-center rounded-full px-4 text-sm text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1] sm:inline-flex"
            >
              Sign in
            </a>

            <Link
              href="/get-started"
              className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-[#046bd2] px-5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(4,107,210,0.4)] transition-all duration-200 hover:bg-[#0579e8] hover:shadow-[0_0_24px_rgba(4,107,210,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]"
            >
              Build your agent
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setOpen(v => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1] md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div key="bd"
              className="fixed inset-0 z-30 bg-black/55 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.18 }}
              onClick={() => setOpen(false)} aria-hidden
            />

            <motion.div id="mobile-nav" key="drawer"
              className="fixed inset-x-0 top-16 z-40 border-b border-white/[0.08] bg-[#000]/95 px-4 pb-6 pt-2 backdrop-blur-xl sm:top-[4.5rem] md:hidden"
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: reduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav aria-label="Mobile navigation">
                <ul className="space-y-1">
                  {NAV.map((item, i) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    return (
                      <motion.li key={item.href}
                        initial={reduced ? undefined : { opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.24, delay: i * 0.045 }}
                      >
                        <Link href={item.href} onClick={() => setOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1] ${
                            isActive
                              ? "bg-white/[0.07] text-white"
                              : "text-white/50 hover:bg-white/[0.04] hover:text-white"
                          }`}
                        >
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                            isActive
                              ? "border-[#046bd2]/35 bg-[#046bd2]/12 text-[#2d98f1]"
                              : "border-white/[0.08] bg-white/[0.03] text-white/35"
                          }`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          {item.label}
                        </Link>
                      </motion.li>
                    )
                  })}
                </ul>

                <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.07] pt-4">
                  <a href="https://voice.Vozpar/" target="_blank" rel="noopener noreferrer"
                    className="flex h-11 items-center justify-center rounded-xl border border-white/10 text-sm text-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]">
                    Sign in
                  </a>
                  <Link href="/get-started" onClick={() => setOpen(false)}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#046bd2] text-sm font-semibold text-white shadow-[0_0_16px_rgba(4,107,210,0.35)] hover:bg-[#0579e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]">
                    Build your agent
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
