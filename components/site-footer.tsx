import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Logo } from "@/components/logo"
import { INDUSTRIES } from "@/lib/industries"

export function SiteFooter() {
  const half = Math.ceil(INDUSTRIES.length / 2)
  const colA = INDUSTRIES.slice(0, half)
  const colB = INDUSTRIES.slice(half)

  return (
    <footer className="relative overflow-hidden border-t border-border/40 bg-background/40">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-[radial-gradient(60%_60%_at_50%_0%,oklch(0.82_0.17_196/0.08),transparent_70%)]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 md:grid-cols-12 md:px-6">
        <div className="md:col-span-4">
          <Link href="/" className="flex items-center" aria-label="9278.ai home">
            <Logo height={40} />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            AI voice agents that actually sound human. Native audio, sub-second latency, and a self-hosted control panel that connects to your existing carrier.
          </p>
          <a
            href="https://dashboard.9278.ai/login"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-sm text-foreground transition-all hover:border-primary/50"
          >
            Customer dashboard
            <ArrowUpRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {/* Live status */}
          <div className="mt-8 inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            All systems operational
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">Product</h3>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li>
              <Link href="/features" className="transition-colors hover:text-foreground">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="transition-colors hover:text-foreground">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/industries" className="transition-colors hover:text-foreground">
                Industries
              </Link>
            </li>
            <li>
              <Link href="/faq" className="transition-colors hover:text-foreground">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/get-started" className="transition-colors hover:text-foreground">
                Get started
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">Industries</h3>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {colA.map((i) => (
              <li key={i.slug}>
                <Link href={`/industries/${i.slug}`} className="transition-colors hover:text-foreground">
                  {i.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">More</h3>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {colB.map((i) => (
              <li key={i.slug}>
                <Link href={`/industries/${i.slug}`} className="transition-colors hover:text-foreground">
                  {i.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-border/40">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:px-6">
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
