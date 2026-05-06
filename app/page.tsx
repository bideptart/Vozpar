import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/sections/hero"
import { PricingFeature } from "@/components/sections/pricing-feature"
import { HumanExperience } from "@/components/sections/human-experience"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Connectivity } from "@/components/sections/connectivity"
import { UseCases } from "@/components/sections/use-cases"
import { Testimonials } from "@/components/sections/testimonials"
import { FAQ } from "@/components/sections/faq"
import { CTA } from "@/components/sections/cta"
import { ServiceJsonLd } from "@/components/seo/jsonld"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ServiceJsonLd
        name="9278.ai — AI voice agents for sales, support and operations"
        description="Build, launch, and scale AI voice agents that actually sound human. Carrier-grade phone numbers, sub-second latency, transparent per-minute pricing."
        path="/"
        serviceType="AI voice agent platform"
      />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HumanExperience />
        <HowItWorks />
        <Connectivity />
        <UseCases />
        <Testimonials />
        <PricingFeature />
        <FAQ />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  )
}
