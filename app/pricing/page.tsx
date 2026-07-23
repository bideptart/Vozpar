import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
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
    <main className="min-h-dvh bg-background text-foreground">
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
      <section className="relative overflow-hidden border-b border-border/50">
        <PricingHero3D />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(4,107,210,0.15),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="relative mx-auto w-full max-w-3xl px-4 py-20 text-center md:px-6 md:py-24">
          <ScrollReveal>
            <span className="ai-pill-blue">
              <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              Pricing
            </span>
            <h1 className="mt-6 text-balance text-4xl font-serif font-normal leading-[1.05] tracking-tight md:text-6xl text-white">
              Pricing built for <span className="text-primary">real conversations.</span>
            </h1>
            <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Per-second voice billing, included minutes, and a phone number in every plan. Pick a plan here and finish
              in seconds on get-started.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Live plans — same source as get-started */}
      <section id="plans" className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <PricingPlans />
      </section>

      {/* FAQ */}
      <BillingFAQ />

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6">
        <ScrollReveal>
          <MouseGlowCard
            glowColor="rgba(4, 107, 210, 0.25)"
            className="rounded-2xl border border-white/10 bg-[#08080a] p-8 md:p-12"
          >
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between relative z-10">
              <div className="max-w-xl">
                <h3 className="text-balance text-2xl font-serif font-normal tracking-tight md:text-3xl text-white">
                  Try before you commit. Talk to our agent now.
                </h3>
                <p className="mt-3 text-muted-foreground text-sm md:text-base">
                  See latency, voice quality, and conversation flow firsthand — then start only if you love it.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="btn-ai rounded-full text-primary-foreground hover:scale-105 transition-transform duration-200">
                  <Link href="/get-started">Get started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/15 hover:bg-white/5">
                  <Link href="/#cta">Talk to an agent</Link>
                </Button>
              </div>
            </div>
          </MouseGlowCard>
        </ScrollReveal>
      </section>

      <RelatedLinks
        variant="flip"
        heading="More on 9278.ai"
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
