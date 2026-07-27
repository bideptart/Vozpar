import type { Metadata } from "next"
import { industriesBody } from "@/lib/industries-fonts"
import { headingType, bodyType, monoStyle } from "@/lib/industries-typography"
import { SiteHeader } from "@/components/site-header"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { IndustryShowcase } from "@/components/industries/industry-showcase"
import {
  FloatingAccents,
  ParticleField,
  AmbientWaveform,
  PulsingDot,
  FloatingIconBadges,
} from "@/components/industries/industries-fx"
import { IndustryMarquee } from "@/components/industries/industry-marquee"
import { StatStrip } from "@/components/industries/stat-strip"
import { IndustryCTA } from "@/components/industries/industry-cta"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"
import { RelatedGuides } from "@/components/industries/related-guides"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = pageSeo({
  title: "Industries we power",
  description:
    "Pre-tuned AI voice agents for real estate, dental, healthcare, home services, restaurants, automotive, legal, education, e-commerce, and fitness — live in under 5 minutes.",
  path: "/industries",
})

export default function IndustriesPage() {
  return (
    <main className={`min-h-dvh bg-black text-foreground ${industriesBody.className}`}>
      {/* ScrollProgressBar (the improved version) now mounts once in
          app/layout.tsx for every route — no longer rendered per-page here. */}
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
        ]}
      />

      <section className="relative overflow-hidden border-b border-border/50 bg-black">
        <FloatingAccents />
        <ParticleField />
        <AmbientWaveform />
        <FloatingIconBadges />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:py-16 md:px-6 md:py-24 lg:py-28">
          <ScrollReveal className="mx-auto max-w-3xl text-center" duration={0.9} y={22}>
            <span className="ai-pill-cyan" style={monoStyle.sectionTag}>
              <PulsingDot />
              Industries
            </span>
            <h1 className={`mt-5 text-balance sm:mt-6 ${headingType.h1}`}>
              An AI voice agent fluent in <span className="text-primary">your industry.</span>
            </h1>
            <p className={`mt-4 text-pretty text-muted-foreground sm:mt-5 ${bodyType.intro}`}>
              Ten pre-tuned playbooks, each shipped with the scripts, integrations, and compliance guardrails your
              business already runs on. Find the closest match below and go live in under 5 minutes.
            </p>
          </ScrollReveal>

          <IndustryMarquee />
          <StatStrip />
        </div>
      </section>

      <IndustryShowcase />

      <IndustryCTA />

      <RelatedGuides
        heading="Related guides"
        description="Explore pricing, FAQs, and the get-started flow used by thousands of teams."
        links={[
          {
            href: "/pricing",
            title: "Pricing — voice from $0.10/min",
            description: "Three top-up tiers, transparent rates, and per-region phone-number pricing.",
          },
          {
            href: "/faq",
            title: "FAQ — credit, numbers, compliance",
            description: "60-day credit, monthly DIDs, HIPAA, TCPA, supported languages, and more.",
          },
          {
            href: "/get-started",
            title: "Launch your first agent",
            description: "Pick a plan, optionally provision a phone number, and you’re live in minutes.",
          },
        ]}
      />

      <SiteFooter />
    </main>
  )
}
