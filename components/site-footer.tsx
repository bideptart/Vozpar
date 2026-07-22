import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Logo } from "@/components/logo"

type FooterLink = { label: string; href: string; external?: boolean }

const PLATFORM: FooterLink[] = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
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
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Acceptable Use", href: "/acceptable-use" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "DPA", href: "/dpa" },
  { label: "All policies", href: "/legal" },
]

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link href={link.href} className="text-slate-400 transition-colors hover:text-white">
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black text-slate-300">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-[radial-gradient(60%_60%_at_50%_0%,oklch(0.577_0.245_27.33/0.10),transparent_70%)]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 md:grid-cols-12 md:px-6">
        {/* Brand */}
        <div className="md:col-span-4">
          <Link href="/" className="flex items-center" aria-label="9278.ai home">
            <Logo height={40} />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
            AI voice agents that actually sound human. Native audio, sub-second latency, and a self-hosted control panel that connects to your existing carrier.
          </p>
          <a
            href="https://voice.9278.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition-all hover:border-primary/60"
          >
            Customer dashboard
            <ArrowUpRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Link columns */}
        <div className="md:col-span-2">
          <FooterColumn title="Platform" links={PLATFORM} />
        </div>
        <div className="md:col-span-2">
          <FooterColumn title="Industries" links={INDUSTRIES} />
        </div>
        <div className="md:col-span-2">
          <FooterColumn title="Company" links={COMPANY} />
        </div>
        <div className="md:col-span-2">
          <FooterColumn title="Legal" links={LEGAL} />
        </div>
      </div>

      {/* Live status — just above the footer divider */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-6 md:px-6">
        <div className="inline-flex items-center gap-2 text-xs text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          All systems operational
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-slate-400 md:flex-row md:items-center md:px-6">
          <p>© {new Date().getFullYear()} 9278.ai. All rights reserved.</p>
          <p className="inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-primary" />
            Made for human conversations.
          </p>
        </div>
      </div>
    </footer>
  )
}
