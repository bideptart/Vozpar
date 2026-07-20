import type { Metadata } from "next"
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
import { FeatureCta, FeatureRelated } from "@/components/sections/feature-outro"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"

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
        {/* Conversion panel */}
        <FeatureCta />

        {/* /features-scoped copy of the site-wide RelatedLinks module — same
            outbound links, brand-reference styling. The shared component is
            still on the legacy look and is used by pages that haven't been
            migrated, so it's deliberately left untouched. */}
        <FeatureRelated
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
