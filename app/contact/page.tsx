import type { Metadata } from "next"
import Link from "next/link"
import { Clock, Mail, MessageSquare, Phone, ArrowUpRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"
import { ContactHero3D } from "@/components/contact/contact-hero-3d"
import { ContactForm } from "@/components/contact/contact-form"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"
import { RelatedLinks } from "@/components/seo/related-links"

export const metadata: Metadata = pageSeo({
  title: "Contact",
  description:
    "Talk to the Vozpar team about pricing, live demos, partnerships, or help with your AI voice agents. Email support, sales, or call our demo agent live.",
  path: "/contact",
})

const CHANNELS = [
  {
    icon: Mail,
    title: "Email support",
    description: "For billing, technical issues, and general questions. We respond within one business day.",
    actionLabel: "support@Vozpar",
    href: "mailto:support@Vozpar",
    badge: "Fast response",
  },
  {
    icon: MessageSquare,
    title: "Sales & partnerships",
    description: "Custom plans, reseller partnerships, or enterprise onboarding for high call volumes.",
    actionLabel: "sales@Vozpar",
    href: "mailto:sales@Vozpar",
    badge: "Enterprise",
  },
  {
    icon: Phone,
    title: "Talk to an agent",
    description: "The fastest way to hear Vozpar in action — call our demo agent and test the experience live.",
    actionLabel: "Try a live demo",
    href: "/get-started",
    badge: "Instant demo",
  },
]

export default function ContactPage() {
  return (
    <main className="min-h-dvh bg-[#04060a] text-foreground">
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      {/* 3D Interactive Hero */}
      <ContactHero3D />

      {/* Form + channels */}
      <section className="relative mx-auto w-full max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/5 blur-[160px]"
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Form */}
          <ScrollReveal className="lg:col-span-7">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-sky-400 shadow-[0_0_15px_rgba(4,107,210,0.15)]">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span>DIRECT MESSAGE</span>
              </div>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Send us a message
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Fill in the form and we&apos;ll get back to you by email, usually within one business day.
              </p>
            </div>

            <ContactForm />
          </ScrollReveal>

          {/* Other ways to reach us */}
          <ScrollReveal className="lg:col-span-5">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-sky-400 shadow-[0_0_15px_rgba(4,107,210,0.15)]">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span>GET IN TOUCH DIRECTLY</span>
              </div>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Other ways to reach us
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Prefer email, or want to hear it live? Take your pick.
              </p>
            </div>

            <StaggerGroup className="flex flex-col gap-5">
              {CHANNELS.map((c) => {
                const Icon = c.icon
                const isExternal = c.href.startsWith("mailto:")
                return (
                  <StaggerItem key={c.title}>
                    <div
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#080a10]/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-sky-500/50 hover:bg-[#0a0d16] hover:shadow-[0_0_30px_rgba(4,107,210,0.25)] hover:-translate-y-1"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Corner Accents */}
                      <span className="pointer-events-none absolute left-2 top-2 h-2.5 w-2.5 border-l-2 border-t-2 border-sky-500/0 transition-all duration-300 group-hover:border-sky-400" />
                      <span className="pointer-events-none absolute right-2 top-2 h-2.5 w-2.5 border-r-2 border-t-2 border-sky-500/0 transition-all duration-300 group-hover:border-sky-400" />

                      <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20 group-hover:bg-sky-500/20 group-hover:text-white transition-all">
                          <Icon className="h-6 w-6" aria-hidden />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-heading text-lg font-semibold tracking-tight text-white group-hover:text-sky-400 transition-colors">
                              {c.title}
                            </h3>
                            <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 font-mono text-[10px] font-medium text-slate-400 border border-white/10">
                              {c.badge}
                            </span>
                          </div>

                          <p className="mt-2 font-sans text-xs leading-relaxed text-slate-300">
                            {c.description}
                          </p>

                          <div className="mt-4">
                            {isExternal ? (
                              <a
                                href={c.href}
                                className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-sky-400 transition-colors hover:text-sky-300"
                              >
                                {c.actionLabel}
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </a>
                            ) : (
                              <Link
                                href={c.href}
                                className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-sky-400 transition-colors hover:text-sky-300"
                              >
                                {c.actionLabel}
                                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                )
              })}
            </StaggerGroup>
          </ScrollReveal>
        </div>
      </section>

      <RelatedLinks
        heading="Before you reach out"
        description="A few answers might already be waiting for you."
        links={[
          {
            href: "/pricing",
            title: "Pricing & per-minute rates",
            description: "Compare Starter, Growth and Scale top-ups and the full phone-number rate card.",
          },
          {
            href: "/faq",
            title: "Frequently asked questions",
            description: "Pricing, credits, phone numbers, compliance and account access — answered.",
          },
          {
            href: "/get-started",
            title: "Launch your first agent",
            description: "Pick a plan, optionally add a number, and place a real test call in minutes.",
          },
        ]}
      />

      <SiteFooter />
    </main>
  )
}
