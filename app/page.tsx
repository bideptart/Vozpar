import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/sections/hero"
import { Benefits } from "@/components/sections/benefits"
import { ProductStory } from "@/components/sections/product-story"
import { HowItWorks } from "@/components/sections/how-it-works"
import { UseCases } from "@/components/sections/use-cases"
import { Integrations } from "@/components/sections/integrations"
import { Carrier } from "@/components/sections/carrier"
import { SelfHosted } from "@/components/sections/self-hosted"
import { Testimonials } from "@/components/sections/testimonials"
import { PricingFeature } from "@/components/sections/pricing-feature"
import { FAQ } from "@/components/sections/faq"
import { CTA } from "@/components/sections/cta"
import { ServiceJsonLd } from "@/components/seo/jsonld"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ServiceJsonLd
        name="Vozpar — AI voice agents that listen, act, and resolve"
        description="Build, deploy, and scale natural-sounding AI voice agents. Sub-300ms latency, native audio, self-hosted — connected to your existing carrier and business tools."
        path="/"
        serviceType="AI voice agent platform"
      />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Benefits />
        <ProductStory />
        <HowItWorks />
        <UseCases />
        <Integrations />
        <Carrier />
        <SelfHosted />
        <Testimonials />
        <PricingFeature />
        <FAQ />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  )
}
