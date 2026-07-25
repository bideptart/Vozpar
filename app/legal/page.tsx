import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"

export const metadata: Metadata = pageSeo({
  title: "Legal & Compliance Center",
  description:
    "All Vozpar legal and compliance documents in one place — terms, privacy, acceptable use, AI-voice disclosure, recording, cookies, DPA, sub-processors, billing, SLA, E911, and accessibility.",
  path: "/legal",
})

type Doc = { title: string; href: string; description: string }

const GROUPS: { heading: string; docs: Doc[] }[] = [
  {
    heading: "Core agreements",
    docs: [
      { title: "Terms of Service", href: "/terms", description: "The Master Services Agreement governing your use of Vozpar." },
      { title: "Privacy Policy", href: "/privacy", description: "How we collect, use, safeguard, and share information." },
      { title: "Acceptable Use Policy", href: "/acceptable-use", description: "Lawful-use rules — calling, texting, AI voice, and prohibited conduct." },
      { title: "AI Voice Disclosure & Responsible-AI", href: "/ai-disclosure", description: "Disclosing AI to callers, no deepfakes, and responsible AI use." },
    ],
  },
  {
    heading: "Data & privacy",
    docs: [
      { title: "Cookie Policy", href: "/cookies", description: "Cookies and similar technologies, and how to manage them." },
      { title: "Data Processing Agreement", href: "/dpa", description: "Controller/processor terms, SCCs, and Art. 32 security measures." },
      { title: "Sub-Processor List", href: "/subprocessors", description: "Third parties that help us provide the Services." },
      { title: "Recording & Monitoring Notice", href: "/recording-notice", description: "Recording, monitoring, transcription, and consent obligations." },
    ],
  },
  {
    heading: "Commercial & service",
    docs: [
      { title: "Billing, Refund & Cancellation", href: "/refund-policy", description: "Charges, renewals, cancellation, refunds, and credit expiry." },
      { title: "Service Level Agreement (SLA)", href: "/sla", description: "Uptime commitment, support targets, and service credits." },
      { title: "Emergency Calling (E911) Notice", href: "/e911", description: "Important safety limitations of internet-based voice." },
      { title: "Accessibility Statement", href: "/accessibility", description: "Our commitment to WCAG, ADA, EAA, and the UK Equality Act." },
    ],
  },
]

export default function LegalCenterPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Legal & Compliance", path: "/legal" },
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
        <div className="relative mx-auto w-full max-w-4xl px-4 py-20 text-center md:px-6 md:py-24">
          <ScrollReveal>
            <span className="ai-pill-magenta">
              <span className="h-1 w-1 rounded-full bg-accent" />
              Legal &amp; Compliance
            </span>
            <h1 className="mt-6 text-balance text-4xl font-serif font-normal tracking-tight md:text-6xl">
              Compliance <span className="text-primary">Center.</span>
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Vozpar is operated by Ace Peak Invest Pte Ltd (Singapore) for the USA, EU, UK, and Latin America. Every
              policy that governs the platform is here.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Document groups */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="flex flex-col gap-14">
          {GROUPS.map((group) => (
            <ScrollReveal key={group.heading}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {group.heading}
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {group.docs.map((doc) => (
                  <Link
                    key={doc.href}
                    href={doc.href}
                    className="card-glow group flex items-start justify-between gap-4 rounded-2xl p-5 transition-colors"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold tracking-tight transition-colors group-hover:text-primary">
                        {doc.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{doc.description}</p>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-14 rounded-2xl border border-border/60 bg-card/30 px-6 py-8 text-sm text-muted-foreground md:px-8">
          <p>
            Questions about any policy? Contact <a className="text-primary hover:underline" href="mailto:legal@Vozpar">legal@Vozpar</a>{" "}
            (legal), <a className="text-primary hover:underline" href="mailto:privacy@Vozpar">privacy@Vozpar</a>{" "}
            (privacy/DPO), or <Link className="text-primary hover:underline" href="/contact">our contact page</Link>. Operator:
            Ace Peak Invest Pte Ltd, 1 Scotts Road #24-10 Shaw Centre, Singapore 228208.
          </p>
        </ScrollReveal>
      </section>

      <SiteFooter />
    </main>
  )
}
