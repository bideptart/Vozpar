import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { Magnetic, SpotlightPanel } from "@/components/animation/magnetic"
import { PricingPlans } from "@/components/pricing/pricing-plans"
import { BillingFAQ } from "@/components/pricing/billing-faq"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"
import { RelatedLinks } from "@/components/seo/related-links"
import { PricingHero3D } from "@/components/pricing/pricing-hero-3d"
import { MouseGlowCard } from "@/components/animation/mouse-glow-card"

export const metadata: Metadata = pageSeo({
  title: "Pricing — AI voice agents",
  description:
    "Simple, per-second voice pricing. Monthly or yearly plans with included minutes, multiple AI agents, and a phone number included. The same live pricing as get-started.",
  path: "/pricing",
})

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>
}) {
  const { canceled } = await searchParams
  return (
    <main className="min-h-dvh bg-background text-foreground" suppressHydrationWarning>
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ]}
      />

      {canceled && (
        <div className="border-b border-border/60 bg-card/40">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 text-sm text-muted-foreground md:px-6">
            <p>Checkout was canceled. You can pick a plan again whenever you&apos;re ready.</p>
          </div>
        </div>
      )}

      {/* Hero */}
      <PricingHero3D />

      {/* Live plans — same source as get-started */}
      <section id="plans" className="mx-auto w-full max-w-6xl px-4 pt-6 pb-16 md:px-6 md:pt-8 md:pb-20">
        <PricingPlans />
      </section>

      {/* FAQ */}
      <BillingFAQ />

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl p-px">
            <span
              aria-hidden
              className="spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[300%] w-[160%] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, #3b82f6 40deg, transparent 100deg, transparent 200deg, #1d4ed8 250deg, transparent 310deg)",
                opacity: 0.85,
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl border"
              style={{ borderColor: "color-mix(in srgb, #3b82f6 35%, transparent)" }}
            />

            <SpotlightPanel
              glow="#3b82f6"
              size={520}
              className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#0b0b0e] px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12"
            >
              <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <span
                  className="sheen-sweep absolute inset-y-0 w-1/3"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, color-mix(in srgb, #3b82f6 12%, transparent), transparent)",
                  }}
                />
              </span>

              <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
                <div className="max-w-xl">
                  <span className="ai-pill-blue">
                    <span className="h-1 w-1 rounded-full bg-current" />
                    Try before you commit
                  </span>

                  <h3 className="mt-4 text-balance font-heading text-2xl font-medium leading-[1.15] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
                    Talk to our AI agent right now.
                  </h3>

                  <p className="mt-3 text-[15px] font-light leading-relaxed text-muted-foreground">
                    See latency, voice quality, and conversation flow firsthand — then start only if you love it. No credit card required to test.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
                      No credit card required
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                      Cancel anytime
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
                      Live in 5 minutes
                    </span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                  <Magnetic strength={0.28} className="w-full sm:w-auto">
                    <Link
                      href="/get-started"
                      className="btn-ai inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-[filter,box-shadow] duration-300 sm:w-auto"
                    >
                      Get started
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </Magnetic>

                  <Magnetic strength={0.22} className="w-full sm:w-auto">
                    <Link
                      href="/#cta"
                      className="inline-flex h-11 w-full items-center justify-center rounded-full bg-black/80 px-6 text-sm font-medium text-foreground border border-white/10 transition-colors duration-300 hover:border-white/30 hover:bg-black sm:w-auto"
                    >
                      Talk to an agent
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </SpotlightPanel>
          </div>
        </ScrollReveal>
      </section>

      <RelatedLinks
        variant="flip"
        heading="More on Vozpar"
        description="Industry playbooks, FAQs, and the get-started flow."
        links={[
          {
            href: "/industries",
            title: "Industries we power",
            description: "Pre-tuned voice agents for ten verticals — and a configurable engine for everything else.",
          },
          {
            href: "/faq",
            title: "FAQ — billing, credit & compliance",
            description: "How credit, phone numbers, and concurrency work in practice.",
          },
          {
            href: "/get-started",
            title: "Launch your first agent",
            description: "Pick a plan, optionally add a number, and you’re live in minutes.",
          },
        ]}
      />

      <SiteFooter />
    </main>
  )
}
