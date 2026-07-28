"use client"

import type React from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Logo } from "@/components/logo"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

type FooterLink = { label: string; href: string; external?: boolean }

const PLATFORM: FooterLink[] = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Dashboard", href: "https://voice.vozpar.app/", external: true },
]

const INDUSTRIES: FooterLink[] = [
  { label: "Real Estate", href: "/industries/real-estate" },
  { label: "Legal Services", href: "/industries/legal" },
  { label: "E-Commerce", href: "/industries/ecommerce" },
  { label: "Restaurants", href: "/industries/restaurants" },
  { label: "Automotive", href: "/industries/automotive" },
  { label: "Home Services", href: "/industries/home-services" },
]

const COMPANY: FooterLink[] = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

const LEGAL: FooterLink[] = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  // Shortened from "Refund & Cancellation" / "Grievance Redressal": at two
  // columns on a 320px phone those wrapped to three lines each.
  { label: "Refunds", href: "/refund-policy" },
  { label: "Grievances", href: "/ai-disclosure" },
  { label: "All policies", href: "/legal" },
]

// One tint per group, reusing the palette the FAQ tabs and Home section
// accents already use — gives the four columns a visual identity instead of
// four identical grey text blocks.
const GROUPS = [
  { key: "platform",   title: "Platform",   links: PLATFORM,   tint: "#2d98f1" },
  { key: "industries", title: "Industries", links: INDUSTRIES, tint: "#10b981" },
  { key: "company",    title: "Company",    links: COMPANY,    tint: "#a855f7" },
  { key: "legal",      title: "Legal",      links: LEGAL,      tint: "#f59e0b" },
]

function FLink({ link }: { link: FooterLink }) {
  // A left border that's transparent until hover, when it picks up the
  // column's tint — reads as the row "lighting up" and keeps the text on a
  // stable baseline (no reflow), unlike an in-flow icon.
  const cls =
    "group relative block border-l border-transparent pl-3 text-sm font-medium text-white/55 transition-all duration-200 hover:border-[var(--tint)] hover:pl-4 hover:text-white sm:text-[15px]"
  const inner = (
    <span className="flex items-center gap-1.5">
      {link.label}
      {link.external && (
        <ArrowUpRight className="h-3 w-3 shrink-0 text-white/25 transition-colors group-hover:text-[var(--tint)]" aria-hidden />
      )}
    </span>
  )
  return link.external ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={link.href} className={cls}>
      {inner}
    </Link>
  )
}

function FooterCol({ title, links, tint }: { title: string; links: FooterLink[]; tint: string }) {
  return (
    <div className="min-w-0" style={{ "--tint": tint } as React.CSSProperties}>
      <p className="mb-4 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/80 sm:text-xs md:text-[13px]">
        <span className="h-3 w-[3px] shrink-0 rounded-full" style={{ background: tint }} aria-hidden />
        {title}
      </p>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.label}>
            <FLink link={l} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-black text-white">
      {/* Subtle top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#046bd2]/25 to-transparent"
      />

      {/* Main grid */}
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="grid min-w-0 gap-10 md:grid-cols-12 md:gap-8">

          {/* Brand column */}
          <ScrollReveal className="min-w-0 md:col-span-3">
            <Link href="/" aria-label="Vozpar home" className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]">
              {/* Smaller mark on phones so it doesn't dominate the column. */}
              <span className="block sm:hidden"><Logo height={28} /></span>
              <span className="hidden sm:block"><Logo height={36} /></span>
            </Link>

            {/* max-w-[260px] was capping the line length on a ~288px-wide
                phone column too, forcing the blurb onto three cramped lines.
                Full width below sm, capped from sm up. */}
            <p className="mt-4 text-[13px] leading-relaxed text-white/35 sm:mt-5 sm:max-w-[260px] sm:text-sm">
              AI voice agents that listen, act, and resolve. Native audio, sub-second
              latency, your own infrastructure.
            </p>

            {/* Dashboard link — full-width tappable row on phones, pill from sm. */}
            <a
              href="https://voice.vozpar.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-white/60 transition-all hover:border-[#046bd2]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1] sm:mt-5 sm:inline-flex sm:w-auto sm:justify-start sm:py-2"
            >
              Customer dashboard
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#2d98f1] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            {/* Social icons removed — all three pointed at placeholder "#"
                hrefs, so they were dead links taking up space. */}
          </ScrollReveal>

          {/* One set of columns at every size — the collapsible <details>
              accordion that used to stand in below md is gone, so every page
              name is visible (and crawlable) without a tap. 2 columns on
              phones, 4 from sm up. */}
          <StaggerGroup className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 md:col-span-9 md:gap-8">
            {GROUPS.map((g) => (
              <StaggerItem key={g.key} className="min-w-0">
                <FooterCol title={g.title} links={g.links} tint={g.tint} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/[0.07]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-white/25 sm:flex-row sm:items-center sm:px-6 sm:text-left">
          <div className="flex items-center gap-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-white/30">All systems operational</span>
          </div>
          <p>© {new Date().getFullYear()} Vozpar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
