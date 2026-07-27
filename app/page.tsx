import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/sections/hero"
import { Benefits } from "@/components/sections/benefits"
import { ProductStory } from "@/components/sections/product-story"
import { HowItWorks } from "@/components/sections/how-it-works"
import { UseCases } from "@/components/sections/use-cases"
import { PlatformCore } from "@/components/sections/platform-core"
import { Testimonials } from "@/components/sections/testimonials"
import { CTA } from "@/components/sections/cta"
import { ServiceJsonLd } from "@/components/seo/jsonld"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-foreground">
      <ServiceJsonLd
        name="Vozpar — AI voice agents that listen, act, and resolve"
        description="Build, deploy, and scale natural-sounding AI voice agents. Sub-300ms latency, native audio, self-hosted — connected to your existing carrier and business tools."
        path="/"
        serviceType="AI voice agent platform"
      />
      {/* ScrollProgressBar now mounts once in app/layout.tsx for every route. */}
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Benefits />
        <ProductStory />
        <HowItWorks />
        <UseCases />
        <PlatformCore />
        <Testimonials />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  )
}
