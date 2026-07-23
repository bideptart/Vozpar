import type { Metadata } from "next"
import Link from "next/link"
import { Clock, Mail, MessageSquare, Phone, ArrowUpRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { ContactForm } from "@/components/contact/contact-form"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"
import { RelatedLinks } from "@/components/seo/related-links"

export const metadata: Metadata = pageSeo({
  title: "Contact",
  description:
    "Talk to the 9278.ai team about pricing, live demos, partnerships, or help with your AI voice agents. Email support, sales, or call our demo agent live.",
  path: "/contact",
})

const CHANNELS = [
  {
    icon: Mail,
    title: "Email support",
    description: "For billing, technical issues, and general questions. We respond within one business day.",
    actionLabel: "support@9278.ai",
    href: "mailto:support@9278.ai",
  },
  {
    icon: MessageSquare,
    title: "Sales & partnerships",
    description: "Custom plans, reseller partnerships, or enterprise onboarding for high call volumes.",
    actionLabel: "sales@9278.ai",
    href: "mailto:sales@9278.ai",
  },
  {
    icon: Phone,
    title: "Talk to an agent",
    description: "The fastest way to hear 9278.ai in action — call our demo agent and test the experience live.",
    actionLabel: "Try a live demo",
    href: "/get-started",
  },
]

export default function ContactPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(220,38,38,0.10),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="relative mx-auto w-full max-w-4xl px-4 py-20 text-center md:px-6 md:py-28">
          <ScrollReveal>
            <span className="ai-pill-magenta">
              <span className="h-1 w-1 rounded-full bg-accent" />
              We&apos;d love to hear from you
            </span>
            <h1 className="mt-6 text-balance text-4xl font-serif font-normal tracking-tight md:text-6xl">
              Get in <span className="text-primary">touch.</span>
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Whether you have a question about pricing, want to see a live demo, or need help with your AI voice
              agents — the 9278.ai team is here.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" aria-hidden />
              Mon–Sat, 9 AM – 7 PM IST · Critical support 24/7
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Form + channels */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-6 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Form */}
          <ScrollReveal className="lg:col-span-7">
            <h2 className="text-2xl font-serif font-normal tracking-tight md:text-3xl">Send us a message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill in the form and we&apos;ll get back to you by email, usually within one business day.
            </p>
            <div className="mt-7">
              <ContactForm />
            </div>
          </ScrollReveal>

          {/* Other ways to reach us */}
          <ScrollReveal className="lg:col-span-5">
            <h2 className="text-2xl font-serif font-normal tracking-tight md:text-3xl">Other ways to reach us</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Prefer email, or want to hear it live? Take your pick.
            </p>
            <div className="mt-7 flex flex-col gap-4">
              {CHANNELS.map((c) => {
                const Icon = c.icon
                const isExternal = c.href.startsWith("mailto:")
                return (
                  <div key={c.title} className="card-glow rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-semibold tracking-tight">{c.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                        {isExternal ? (
                          <a
                            href={c.href}
                            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline"
                          >
                            {c.actionLabel}
                          </a>
                        ) : (
                          <Link
                            href={c.href}
                            className="group mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline"
                          >
                            {c.actionLabel}
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
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
