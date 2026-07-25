import type { Metadata } from "next"
import { industriesBody } from "@/lib/industries-fonts"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Features } from "@/components/sections/features"
import { FeatureCallDemo } from "@/components/sections/feature-call-demo"
import { FeatureShowcase } from "@/components/sections/feature-showcase"
import { FeatureLatencyLab } from "@/components/sections/feature-latency-lab"
import { FeatureJourney } from "@/components/sections/feature-journey"
import { FeatureIvrRace } from "@/components/sections/feature-ivr-race"
import { FeatureCta } from "@/components/sections/feature-outro"
import { RelatedGuides } from "@/components/industries/related-guides"
import { ScrollProgressBar } from "@/components/industries/scroll-progress"
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
    <main className={`min-h-dvh bg-black text-foreground ${industriesBody.className}`} suppressHydrationWarning>
      <ScrollProgressBar />
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ]}
      />

      <div className="flex-1">
        {/* Hero → stats band */}
        <Features />
        {/* Show it working before describing it: a replayable inbound call */}
        <FeatureCallDemo />
        {/* Interactive explorer for capabilities */}
        <FeatureShowcase />
        {/* Makes the headline latency claim something you can feel, not just read */}
        <FeatureLatencyLab />
        {/* The console around the capabilities above: five stages from first agent to running the desk */}
        <FeatureJourney />
        {/* Same job, two paths, side by side */}
        <FeatureIvrRace />
        {/* Conversion panel */}
        <FeatureCta />

        {/* /features-scoped copy of the site-wide RelatedLinks module styled like Industries page */}
        <RelatedGuides
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
      </div>

      <SiteFooter />
    </main>
  )
}
