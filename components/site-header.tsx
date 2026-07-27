"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Menu, X, AudioLines, Building2, HelpCircle, Tag, Newspaper } from "lucide-react"
import { motion, AnimatePresence, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react"
import { Logo } from "@/components/logo"

const NAV = [
  { href: "/features",   label: "Features",   icon: AudioLines },
  { href: "/industries", label: "Industries", icon: Building2  },
  { href: "/pricing",    label: "Pricing",    icon: Tag        },
  { href: "/blog",       label: "Blog",       icon: Newspaper  },
  { href: "/faq",        label: "FAQ",        icon: HelpCircle },
]

/**
 * Floating-dock header: a rounded, inset bar with a small top gap instead
 * of a full-bleed edge-to-edge strip — reads less like a browser chrome
 * element and more like a deliberate UI surface, matching the rest of the
 * site's card language (rounded-2xl, hairline border, tinted glow).
 *
 *   • Compacts on scroll — height, blur, and border opacity all step up
 *     once the visitor moves past the very top, so the bar recedes on a
 *     fresh page load and asserts itself once there's content behind it.
 *   • The active-route indicator is a tinted blue glow pill (was flat
 *     white/[0.07]) so it matches the accent color used everywhere else
 *     instead of reading as a generic selected-state gray.
 *   • The primary CTA carries the same periodic shimmer sweep as the CTA
 *     section's button, so the one button repeated across every page has a
 *     bit of life instead of being a flat static pill.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 12
    setScrolled((prev) => (prev === next ? prev : next))
  })

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-2.5 pt-2.5 sm:px-4 sm:pt-3">
        {/* Ambient glow behind the whole dock — faint at rest, so the bar
            never sits as a flat black rectangle even before scrolling. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-24 max-w-4xl opacity-40"
          style={{ background: "radial-gradient(50% 100% at 50% 0%, rgba(4,107,210,0.22) 0%, transparent 75%)" }}
        />

        <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-2xl p-px">
          {/* Slow-rotating conic gradient clipped to a 1px ring — the same
              "living border" technique used on the CTA and PlatformCore
              panels, so the header carries the site's own signature detail
              instead of a static hairline. */}
          {!reduced && (
            <span
              aria-hidden
              className="spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[400%] w-[140%] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, #046bd2 30deg, transparent 80deg, transparent 220deg, #2d98f1 260deg, transparent 310deg)",
                opacity: 0.55,
              }}
            />
          )}

          <div
            className={`relative flex w-full items-center justify-between rounded-[calc(1rem-1px)] border px-3 transition-[height,background-color,border-color,box-shadow] duration-300 sm:px-5 ${
              scrolled
                ? "h-14 border-white/[0.12] bg-black/90 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl"
                : "h-16 border-white/[0.08] bg-black/65 backdrop-blur-lg"
            }`}
          >
            {/* Logo, with a soft glow halo that appears on hover. */}
            <Link href="/" aria-label="Vozpar home"
              className="group/logo relative flex-shrink-0 transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1] focus-visible:rounded-sm">
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-[#2d98f1]/0 blur-lg transition-colors duration-300 group-hover/logo:bg-[#2d98f1]/20"
              />
              <Logo height={30} priority />
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
              {NAV.map(item => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link key={item.href} href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1] ${
                      isActive ? "text-white" : "text-white/50 hover:text-white/85"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full border border-[#2d98f1]/35"
                        style={{
                          background: "linear-gradient(135deg, rgba(45,152,241,0.18) 0%, rgba(4,107,210,0.08) 100%)",
                          boxShadow: "0 0 16px rgba(45,152,241,0.25)",
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    <Icon
                      className={`relative h-3.5 w-3.5 transition-colors duration-150 ${
                        isActive ? "text-[#2d98f1]" : "text-white/30 group-hover:text-white/60"
                      }`}
                      aria-hidden
                    />
                    <span className="relative">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <a
                href="https://voice.Vozpar/" target="_blank" rel="noopener noreferrer"
                className="hidden h-9 items-center rounded-full border border-white/10 px-4 text-sm text-white/55 transition-colors hover:border-white/20 hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1] sm:inline-flex"
              >
                Sign in
              </a>

            {/* Full pill on sm and up. Below that the label wraps into two
                lines and breaks the bar (the mobile drawer already repeats
                this CTA full-width at the bottom), so a compact icon-only
                version stands in its place instead. */}
            <Link
              href="/get-started"
              className="group/btn relative hidden h-9 items-center gap-1.5 overflow-hidden rounded-full bg-[#046bd2] whitespace-nowrap px-5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(4,107,210,0.4)] transition-all duration-200 hover:bg-[#0579e8] hover:shadow-[0_0_24px_rgba(4,107,210,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1] sm:inline-flex"
            >
              <span className="relative z-10 inline-flex items-center gap-1.5">
                Build your agent
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </span>
              {!reduced && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-140%", "340%"] }}
                  transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3.5, ease: "easeInOut" }}
                />
              )}
            </Link>

            <Link
              href="/get-started"
              aria-label="Build your agent"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#046bd2] text-white shadow-[0_0_16px_rgba(4,107,210,0.4)] transition-all duration-200 hover:bg-[#0579e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1] sm:hidden"
            >
              <ArrowRight className="h-4 w-4" />
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
              className="fixed inset-x-2.5 top-[4.75rem] z-40 rounded-2xl border border-white/[0.1] bg-[#000]/95 px-4 pb-6 pt-2 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.7)] backdrop-blur-xl md:hidden"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
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
