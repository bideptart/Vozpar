import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  Features,
  FeatureCallDemo,
  FeatureShowcase,
  FeatureLatencyLab,
  FeatureJourney,
  FeatureIvrRace,
  FeatureCta,
  FeatureRelated,
} from "@/components/features"
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
        {/* Interactive explorer for all 12 capabilities */}
        <FeatureShowcase />
        {/* Makes the headline latency claim something you can feel, not just read */}
        <FeatureLatencyLab />
        {/* Five stages from first agent to running the desk */}
        <FeatureJourney />
        {/* Same call, two paths */}
        <FeatureIvrRace />
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
