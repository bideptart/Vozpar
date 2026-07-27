"use client"

import Link from "next/link"
import { ArrowUpRight, ChevronRight, Github, Twitter, Linkedin } from "lucide-react"
import { Logo } from "@/components/logo"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

type FooterLink = { label: string; href: string; external?: boolean }

const PLATFORM: FooterLink[] = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Dashboard", href: "https://voice.9278.ai/", external: true },
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
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund & Cancellation", href: "/refund-policy" },
  { label: "Grievance Redressal", href: "/ai-disclosure" },
  { label: "All policies →", href: "/legal" },
]

const GROUPS = [
  { key: "platform", title: "Platform", links: PLATFORM },
  { key: "industries", title: "Industries", links: INDUSTRIES },
  { key: "company", title: "Company", links: COMPANY },
  { key: "legal", title: "Legal", links: LEGAL },
]

const SOCIALS = [
  { icon: Twitter,  href: "#", label: "Twitter / X" },
  { icon: Linkedin, href: "#", label: "LinkedIn"    },
  { icon: Github,   href: "#", label: "GitHub"      },
]

function FLink({ link }: { link: FooterLink }) {
  const cls =
    "group flex items-center gap-1.5 text-base font-medium text-white/60 transition-colors hover:text-white"
  const inner = (
    <>
      <ChevronRight
        className="h-3.5 w-3.5 -translate-x-1 text-[#046bd2] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
        aria-hidden
      />
      <span className="transition-transform duration-200 group-hover:translate-x-0.5">
        {link.label}
      </span>
    </>
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

function FooterCol({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <p className="mb-4 font-mono text-xs md:text-[13px] font-bold uppercase tracking-[0.18em] text-white/80">
        {title}
      </p>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <FLink link={l} />
          </li>
        ))}
      </ul>
    </div>
  )
}

// Mobile: collapsible group using native <details> — no JS dependency,
// works with keyboard, locks body scroll is not needed for footer.
function MobileGroup({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <details className="group border-b border-white/[0.07]">
      <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]">
        {title}
        <ChevronRight
          className="h-4 w-4 transition-transform duration-200 group-open:rotate-90"
          aria-hidden
        />
      </summary>
      <ul className="space-y-3 pb-4">
        {links.map((l) => (
          <li key={l.label}>
            <FLink link={l} />
          </li>
        ))}
      </ul>
    </details>
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
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-12">

          {/* Brand column */}
          <ScrollReveal className="md:col-span-3">
            <Link href="/" aria-label="Vozpar home" className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1] rounded-sm">
              <Logo height={36} />
            </Link>
            <p className="mt-5 max-w-[260px] text-sm leading-relaxed text-white/35">
              AI voice agents that listen, act, and resolve. Native audio, sub-second
              latency, your own infrastructure.
            </p>

            {/* Dashboard link */}
            <a
              href="https://voice.Vozpar/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-sm text-white/60 transition-all hover:border-[#046bd2]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]"
            >
              Customer dashboard
              <ArrowUpRight className="h-3.5 w-3.5 text-[#2d98f1] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-white/35 transition-colors hover:border-[#046bd2]/40 hover:text-[#2d98f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                )
              })}
            </div>
          </ScrollReveal>

          {/* Desktop link columns */}
          <StaggerGroup className="hidden gap-8 md:col-span-9 md:grid md:grid-cols-4">
            {GROUPS.map((g) => (
              <StaggerItem key={g.key}>
                <FooterCol title={g.title} links={g.links} />
              </StaggerItem>
            ))}
          </StaggerGroup>

          {/* Mobile accordion columns */}
          <div className="md:hidden">
            {GROUPS.map((g) => (
              <MobileGroup key={g.key} title={g.title} links={g.links} />
            ))}
          </div>
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
