import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Features } from "@/components/sections/features"
import { FeatureCallDemo } from "@/components/sections/feature-call-demo"
import { FeatureShowcase } from "@/components/sections/feature-showcase"
import { FeatureLatencyLab } from "@/components/sections/feature-latency-lab"
import { FeaturePillars } from "@/components/sections/feature-pillars"
import { FeatureIntegrations } from "@/components/sections/feature-integrations"
import { FeatureIvrRace } from "@/components/sections/feature-ivr-race"
import { FeatureComparison } from "@/components/sections/feature-comparison"
import { Button } from "@/components/ui/button"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"
import { RelatedLinks } from "@/components/seo/related-links"

export const metadata: Metadata = pageSeo({
  title: "Features",
  description:
    "Sub-300ms latency, carrier-grade telephony, multilingual voices, tools & function calling, live transfer, transcripts, compliance and more — everything you need to ship a real-world AI voice agent.",
  path: "/features",
})

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ]}
      />

      <main className="flex-1">
        {/* Hero → stats band */}
        <Features />
        {/* Show it working before describing it: a replayable inbound call */}
        <FeatureCallDemo />
        {/* Interactive explorer for all 12 capabilities */}
        <FeatureShowcase />
        {/* Makes the headline latency claim something you can feel, not just read */}
        <FeatureLatencyLab />
        {/* The same features regrouped into the three stories buyers evaluate */}
        <FeaturePillars />
        {/* What it writes back to */}
        <FeatureIntegrations />
        {/* The emotional version of the comparison — same job, two paths, side by side.
            Deliberately sits directly above the table: race first, spreadsheet second. */}
        <FeatureIvrRace />
        {/* Where it sits vs legacy IVR / building in-house */}
        <FeatureComparison />

        <section
          className="relative overflow-hidden border-t border-border py-16 md:py-24"
          style={{ background: "var(--features-hero-bg)" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-50 blur-[100px]"
            style={{ background: "color-mix(in srgb, var(--features-blue) 40%, transparent)" }}
          />
          <div className="features-hero-dark relative mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 px-5 py-10 backdrop-blur-md sm:px-8 md:px-12 md:py-14">
              <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <h3 className="text-balance font-heading text-xl font-medium leading-[1.2] tracking-[-0.025em] text-foreground sm:text-2xl md:text-3xl">
                    Ready to hear it for yourself?
                  </h3>
                  <p className="mt-3 text-[15px] font-light leading-relaxed text-muted-foreground">
                    Spin up an agent in minutes and place a real test call — no credit card to try.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--features-blue)" }} />
                      No credit card required
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--features-blue-deep)" }} />
                      Cancel anytime
                    </span>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                  <Button
                    asChild
                    size="lg"
                    className="border-0 text-white hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, var(--features-blue), var(--features-blue-deep))" }}
                  >
                    <Link href="/get-started">Get started</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link href="/pricing">View pricing</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <RelatedLinks
          heading="Keep exploring"
          description="Where teams head next after the feature tour."
          links={[
            {
              href: "/pricing",
              title: "Pricing & per-minute rates",
              description: "Compare Starter, Growth and Scale top-ups and see the full phone-number rate card.",
            },
            {
              href: "/industries",
              title: "Industries — pre-tuned playbooks",
              description: "Real estate, dental, healthcare, home services, restaurants, automotive, and more.",
            },
            {
              href: "/faq",
              title: "Frequently asked questions",
              description: "Pricing, credits, phone numbers, compliance and account access — answered.",
            },
          ]}
        />
      </main>

      <SiteFooter />
    </div>
  )
}
