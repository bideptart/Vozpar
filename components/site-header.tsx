"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, AudioLines, Building2, HelpCircle, Tag } from "lucide-react"
import { motion, useReducedMotion } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"

const NAV = [
  { href: "/features", label: "Features", icon: AudioLines },
  { href: "/industries", label: "Industries", icon: Building2 },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
]

/**
 * Hamburger that morphs into an X. Three CSS-transitioned bars rather than a
 * lucide icon swap — swapping icon components on toggle would pop between
 * two unrelated shapes with no in-between frame; three bars can actually
 * animate through the X shape.
 */
function MenuToggle({ open }: { open: boolean }) {
  const reduced = useReducedMotion()
  const dur = reduced ? "duration-0" : "duration-300"
  return (
    <span className="relative flex h-4 w-4 flex-col items-center justify-center">
      <span
        className={`absolute h-[1.5px] w-4 rounded-full bg-current transition-transform ${dur} ease-out ${
          open ? "translate-y-0 rotate-45" : "-translate-y-[5px] rotate-0"
        }`}
      />
      <span
        className={`absolute h-[1.5px] w-4 rounded-full bg-current transition-opacity ${dur} ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute h-[1.5px] w-4 rounded-full bg-current transition-transform ${dur} ease-out ${
          open ? "translate-y-0 -rotate-45" : "translate-y-[5px] rotate-0"
        }`}
      />
    </span>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  // Below `md` the pill nav disappears entirely (it's `hidden md:flex`) with
  // nothing standing in for it — a phone visitor had no way to reach
  // Features/Industries/Pricing/FAQ except the URL bar. This sheet is that
  // replacement, not a duplicate: it renders the same NAV list so there's
  // still exactly one place editing the link set.
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const reduced = useReducedMotion()
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="absolute inset-x-0 top-0 h-full border-b border-white/10 bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-transparent shadow-[0_8px_32px_-8px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150" />
      {/* glossy bottom edge highlight */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-20 md:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="9278.ai home">
          <Logo height={38} priority />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_24px_-8px_rgba(0,0,0,0.4)] backdrop-blur-2xl backdrop-saturate-150 md:flex"
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

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden h-9 sm:inline-flex">
            <a href="https://voice.9278.ai/" target="_blank" rel="noopener noreferrer">
              Sign in
            </a>
          </Button>
          <Button asChild size="sm" className="group btn-ai h-9 rounded-full px-4">
            <Link href="/get-started">
              Get started
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>

          {/* Hamburger — the only way into NAV below `md`, where the pill
              bar above is hidden. */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((o) => !o)}
          >
            <MenuToggle open={mobileNavOpen} />
          </Button>
        </div>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="right"
          // Radix unmounts SheetContent on close by default, so every open
          // is a fresh mount — that's what lets the motion stagger below
          // replay each time, no `key` reset trick needed.
          //
          // Deliberately keeps the default Sheet close (X) button: the
          // panel covers the same right-hand corner the header's own
          // hamburger-turned-X sits in, so that toggle is hidden behind this
          // panel the moment it's open and can't double as the close
          // control — Escape/backdrop-click plus this button are the real
          // ways out.
          className="flex w-[85%] flex-col overflow-hidden border-white/10 bg-black/95 p-0 text-foreground shadow-[-24px_0_60px_-24px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:max-w-xs"
        >
          {/* Top-corner glow, matches the header's glass treatment instead
              of the panel reading as a flat, unrelated slab. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 30%, transparent), transparent 70%)" }}
          />

          <SheetTitle className="sr-only">Navigation</SheetTitle>

          <div className="relative flex h-16 items-center justify-between border-b border-white/10 px-5">
            <Link href="/" onClick={() => setMobileNavOpen(false)} className="flex items-center" aria-label="9278.ai home">
              <Logo height={26} />
            </Link>
          </div>

          <motion.nav
            aria-label="Primary"
            initial={reduced ? false : "hidden"}
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
            className="relative flex flex-col gap-1 p-3"
          >
            {NAV.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon
              return (
                <motion.div
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, x: 16 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-base transition-colors ${
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {/* Sliding active fill — same shared-background idea as
                        the desktop pill nav's underline, just a full-row
                        wash instead, since there's no pill track here. */}
                    {isActive && (
                      <motion.span
                        layoutId="mobile-nav-active"
                        className="absolute inset-0 rounded-xl border border-white/10 bg-white/[0.06]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span
                      className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        isActive ? "border-primary/40 bg-primary/15 text-primary" : "border-white/10 bg-white/[0.03] group-hover:border-white/20"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="relative">{item.label}</span>
                    <ArrowRight
                      className={`relative ml-auto h-4 w-4 shrink-0 text-muted-foreground/50 transition-all ${
                        isActive ? "opacity-0" : "opacity-0 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                    />
                  </Link>
                </motion.div>
              )
            })}
          </motion.nav>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.3 } }}
            className="relative mt-auto flex flex-col gap-2 border-t border-white/10 p-4"
          >
            <Button asChild variant="ghost" className="w-full justify-center">
              <a href="https://voice.9278.ai/" target="_blank" rel="noopener noreferrer">
                Sign in
              </a>
            </Button>
            <Button asChild className="btn-ai w-full justify-center rounded-full">
              <Link href="/get-started" onClick={() => setMobileNavOpen(false)}>
                Get started
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </motion.div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
