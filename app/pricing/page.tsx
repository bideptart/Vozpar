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
          <div className="rounded-2xl border border-white/10 bg-[#08080a] p-8 md:p-12">
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
                <Button asChild size="lg" className="btn-ai rounded-full text-primary-foreground">
                  <Link href="/get-started">Get started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/15">
                  <Link href="/#cta">Talk to an agent</Link>
                </Button>
              </div>
            </div>
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
