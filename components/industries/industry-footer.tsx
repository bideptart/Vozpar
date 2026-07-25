"use client"

import Link from "next/link"
import { ArrowUpRight, Layers, Building2, Users, Scale, type LucideIcon } from "lucide-react"
import { motion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { FloatingAccents, ParticleField, Magnetic, PulsingDot } from "@/components/industries/industries-fx"
import { Logo } from "@/components/logo"
import { bodyType, monoStyle } from "@/lib/industries-typography"

/**
 * RETIRED (2026-07-23) — no longer imported anywhere. `app/industries/page.tsx`
 * was the one page using this instead of the shared `SiteFooter`
 * (components/site-footer.tsx), which every other page uses. The user
 * explicitly asked for one identical header/footer across the whole site —
 * edits to the shared footer (mobile accordion, hover chevrons, etc.) were
 * silently not reaching this page because it never rendered `SiteFooter` to
 * begin with. Swapped `/industries` over to `SiteFooter` to fix that. Left
 * in place only because this session's tools can't delete a file; safe to
 * remove outright.
 *
 * Original doc, kept for history: industries-page-only footer that
 * replicated the shared footer's links with its own animations and styling
 * tuned to match the rest of that page (icon-badge column headings,
 * gradient "Customer dashboard" CTA, particle field, per-link stagger,
 * shimmer sweep, etc).
 */

type FooterLink = { label: string; href: string; external?: boolean }

const PLATFORM: FooterLink[] = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Dashboard", href: "https://voice.9278.ai/", external: true },
]

const INDUSTRIES_LINKS: FooterLink[] = [
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

const linkItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
}

function FooterColumn({
  title,
  icon: Icon,
  links,
  delay,
}: {
  title: string
  icon: LucideIcon
  links: FooterLink[]
  delay: number
}) {
  return (
    <ScrollReveal delay={delay}>
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 flex-none items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden />
        </span>
        <h3 className="uppercase text-white" style={{ ...monoStyle.strongLabel, fontSize: "15px", letterSpacing: "0.8px" }}>
          {title}
        </h3>
      </div>
      <span aria-hidden className="mt-3 block h-px w-8 bg-gradient-to-r from-primary to-transparent" />
      <motion.ul
        className="mt-6 space-y-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
      >
        {links.map((link) => (
          <motion.li key={link.label} variants={linkItemVariants}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group/flink relative inline-flex items-center text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-white ${bodyType.linkNav}`}
                style={{ fontSize: "19px", fontWeight: 500 }}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover/flink:w-full" />
              </a>
            ) : (
              <Link
                href={link.href}
                className={`group/flink relative inline-flex items-center text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-white ${bodyType.linkNav}`}
                style={{ fontSize: "19px", fontWeight: 500 }}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover/flink:w-full" />
              </Link>
            )}
          </motion.li>
        ))}
      </motion.ul>
    </ScrollReveal>
  )
}

export function IndustryFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black text-muted-foreground">
      <FloatingAccents />
      <ParticleField />

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-4 py-20 md:grid-cols-12 md:px-6">
        {/* Brand */}
        <ScrollReveal className="relative md:col-span-4 md:border-r md:border-white/10 md:pr-8">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-10 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
          />
          <Link
            href="/"
            className="relative inline-flex items-center transition-transform duration-300 hover:scale-[1.03]"
            aria-label="Vozpar home"
          >
            <Logo height={68} />
          </Link>
          <p
            className={`relative mt-7 max-w-md text-muted-foreground ${bodyType.paragraph}`}
            style={{ fontSize: "18px", fontWeight: 400, lineHeight: 1.65 }}
          >
            AI voice agents that actually sound human. Native audio, sub-second latency, and a self-hosted control
            panel that connects to your existing carrier.
          </p>
          <Magnetic>
            <a
              href="https://voice.Vozpar/"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative mt-8 inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 text-white shadow-[0_8px_24px_-8px_var(--primary)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-10px_var(--primary)] ${bodyType.button}`}
              style={{ fontSize: "17px", fontWeight: 600 }}
            >
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                animate={{ x: ["-140%", "340%"] }}
                transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3.5, ease: "easeInOut" }}
              />
              <span className="relative">Customer dashboard</span>
              <ArrowUpRight className="relative h-4 w-4 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>
        </ScrollReveal>

        {/* Link columns */}
        <div className="md:col-span-2">
          <FooterColumn title="Platform" icon={Layers} links={PLATFORM} delay={0.05} />
        </div>
        <div className="md:col-span-2">
          <FooterColumn title="Industries" icon={Building2} links={INDUSTRIES_LINKS} delay={0.1} />
        </div>
        <div className="md:col-span-2">
          <FooterColumn title="Company" icon={Users} links={COMPANY} delay={0.15} />
        </div>
        <div className="md:col-span-2">
          <FooterColumn title="Legal" icon={Scale} links={LEGAL} delay={0.2} />
        </div>
      </div>

      {/* Live status */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-6 md:px-6">
        <ScrollReveal delay={0.25} y={8}>
          <span className="ai-pill-cyan" style={{ ...monoStyle.tinyLabel, fontSize: "12px", letterSpacing: "0.6px" }}>
            <PulsingDot className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            All systems operational
          </span>
        </ScrollReveal>
      </div>

      <div className="relative border-t border-white/10">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-100%", "500%"] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", repeatDelay: 1 }}
        />
        <ScrollReveal
          y={8}
          className={`mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-muted-foreground md:flex-row md:items-center md:px-6 ${bodyType.smallPrint}`}
        >
          <p style={{ fontSize: "13px" }}>© {new Date().getFullYear()} Vozpar. All rights reserved.</p>
          <p className="inline-flex items-center gap-2" style={{ fontSize: "13px" }}>
            <PulsingDot className="h-1 w-1 rounded-full bg-primary" />
            Made for human conversations.
          </p>
        </ScrollReveal>
      </div>
    </footer>
  )
}
