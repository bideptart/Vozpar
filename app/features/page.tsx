import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Features } from "@/components/sections/features"
import { FeatureCallDemo } from "@/components/sections/feature-call-demo"
import { FeatureShowcase } from "@/components/sections/feature-showcase"
import { FeatureLatencyLab } from "@/components/sections/feature-latency-lab"
import { FeatureAnatomy } from "@/components/sections/feature-anatomy"
import { FeatureJourney } from "@/components/sections/feature-journey"
import { FeatureIvrRace } from "@/components/sections/feature-ivr-race"
import { FeatureComparison } from "@/components/sections/feature-comparison"
import { FeatureTrust } from "@/components/sections/feature-trust"
import { FeatureCta, FeatureRelated } from "@/components/sections/feature-outro"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"

export const metadata: Metadata = pageSeo({
  title: "Features",
  description:
    "Sub-300ms latency, carrier-grade telephony, multilingual voices, tools & function calling, live transfer, transcripts, compliance and more — everything you need to ship a real-world AI voice agent.",
  path: "/features",
})

// suppressHydrationWarning below: a browser extension (Bitdefender and
// similar security/ad-block extensions are the common culprits) injects a
// `bis_skin_checked` attribute onto page elements after load. React then
// sees an attribute on the client that wasn't in the server HTML and flags
// it as a hydration mismatch — it isn't an app bug, the extension is
// modifying the DOM after React already rendered it.
export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground" suppressHydrationWarning>
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
        {/* The signal path a call actually takes. Replaced the old "three
            pillars" block, which only re-listed the showcase's own bullets. */}
        <FeatureAnatomy />
        {/* The console around the capabilities above: five stages from first
            agent to running the desk (build, train, test, operate, account).
            Deliberately different content from FeatureShowcase's 12 technical
            capabilities — this is workflow, not tech. */}
        <FeatureJourney />
        {/* The emotional version of the comparison — same job, two paths, side by side.
            Deliberately sits directly above the table: race first, spreadsheet second. */}
        <FeatureIvrRace />
        {/* Where it sits vs legacy IVR / building in-house */}
        <FeatureComparison />
        {/* Last objection before the CTA: everything above is a performance
            claim, this is the checkable one. Every figure is sourced from
            /sla, /dpa, /subprocessors and /e911 and links back to them. */}
        <FeatureTrust />
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
              icon: "pricing",
            },
            {
              href: "/industries",
              title: "Industries — pre-tuned playbooks",
              description: "Real estate, dental, healthcare, home services, restaurants, automotive, and more.",
              icon: "industries",
            },
            {
              href: "/faq",
              title: "Frequently asked questions",
              description: "Pricing, credits, phone numbers, compliance and account access — answered.",
              icon: "faq",
            },
          ]}
        />
      </main>

      <SiteFooter />
    </div>
  )
}
