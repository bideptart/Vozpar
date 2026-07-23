import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Globe2, ShieldCheck, Sparkles, Zap, PhoneCall, Server } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"
import { RelatedLinks } from "@/components/seo/related-links"

export const metadata: Metadata = pageSeo({
  title: "About",
  description:
    "9278.ai builds AI voice agents that actually sound human — carrier-grade, self-hosted, and sub-second. Operated by Ace Peak Invest Pte Ltd across the USA, Europe, UK, and Latin America.",
  path: "/about",
})

const VALUES = [
  {
    icon: PhoneCall,
    title: "Conversations, not menus",
    description:
      "Native audio, real interruptions, and natural turn-taking — agents that hold a real conversation instead of reading a script.",
  },
  {
    icon: Zap,
    title: "Sub-second by default",
    description:
      "We obsess over latency. Under 300ms response times keep calls feeling human, never robotic or laggy.",
  },
  {
    icon: Server,
    title: "Your data, your stack",
    description:
      "A self-hosted control panel that connects to the carrier you already use. You keep ownership of numbers, billing, and recordings.",
  },
  {
    icon: ShieldCheck,
    title: "Built for compliance",
    description:
      "AI-voice disclosure, recording consent, and data-protection guardrails across US, EU/UK, and LATAM — engineered in, not bolted on.",
  },
]

const STATS = [
  { value: "<300ms", label: "Voice latency" },
  { value: "100+", label: "Active regions" },
  { value: "99.99%", label: "Platform uptime" },
  { value: "24/7", label: "Critical support" },
]

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
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
              About 9278.ai
            </span>
            <h1 className="mt-6 text-balance text-4xl font-serif font-normal leading-[1.05] tracking-tight md:text-6xl">
              Voice AI that <span className="text-primary">actually sounds human.</span>
            </h1>
            <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              9278.ai helps businesses build, launch, and scale AI voice agents that answer and place real phone calls —
              with native audio, sub-second latency, and the carrier you already trust.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6 md:py-20">
        <ScrollReveal className="space-y-5 text-pretty leading-relaxed text-muted-foreground md:text-lg">
          <h2 className="text-balance text-3xl font-serif font-normal tracking-tight text-foreground md:text-4xl">
            Why we built it
          </h2>
          <p>
            Phone calls are still where the most important conversations happen — a booking, a quote, a support
            emergency. Yet most businesses either miss them or bury callers in clunky IVR menus. Early voicebots
            didn&rsquo;t help: they were slow, robotic, and obviously machines.
          </p>
          <p>
            We started 9278.ai to change that. Our platform runs an audio-native conversational engine that listens,
            interrupts, and responds in real time — so a caller feels heard, not processed. It plugs into your existing
            carrier and knowledge base, and you run it from a control panel you host yourself.
          </p>
          <p>
            The result is an AI receptionist, sales rep, or support agent that&rsquo;s live in an afternoon, answers
            every call, and sounds like someone who actually wants to help.
          </p>
        </ScrollReveal>
      </section>

      {/* Stats band */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
          {STATS.map((s) => (
            <ScrollReveal key={s.label} className="text-center">
              <p className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <ScrollReveal className="mb-10 max-w-2xl">
          <h2 className="text-balance text-3xl font-serif font-normal tracking-tight md:text-4xl">What we believe</h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            The principles behind every agent you build on 9278.ai.
          </p>
        </ScrollReveal>
        <div className="grid gap-5 md:grid-cols-2">
          {VALUES.map((v) => {
            const Icon = v.icon
            return (
              <ScrollReveal key={v.title}>
                <div className="card-glow h-full rounded-2xl p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* Company */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6 md:pb-20">
        <ScrollReveal className="grid gap-8 rounded-2xl border border-border/60 bg-card/30 p-8 md:grid-cols-2 md:p-12">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Globe2 className="h-3.5 w-3.5" /> The company
            </span>
            <h2 className="mt-4 text-balance text-2xl font-serif font-normal tracking-tight md:text-3xl">
              Carrier-grade, globally.
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              9278.ai is operated by <strong className="text-foreground">Ace Peak Invest Pte Ltd</strong>, a company
              registered in Singapore, with voice infrastructure spanning the USA, Europe, the UK, and Latin America. We
              run on real telecom rails — not a demo — with the licensing and robocall-mitigation that carrier-grade
              calling requires.
            </p>
          </div>
          <div className="grid content-center gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <p className="text-muted-foreground">
                <span className="text-foreground">Markets:</span> USA, EU, UK &amp; Latin America (Brazil, Mexico,
                Colombia, Argentina, and more).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <p className="text-muted-foreground">
                <span className="text-foreground">Compliance-first:</span> STIR/SHAKEN, 10DLC, GDPR/UK, and LGPD aligned.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <p className="text-muted-foreground">
                <span className="text-foreground">Talk to us:</span>{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact the team
                </Link>{" "}
                or email support@9278.ai.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6">
        <ScrollReveal className="rounded-2xl border border-border/60 bg-card/30 px-6 py-12 text-center md:px-12 md:py-14">
          <h2 className="text-balance text-2xl font-serif font-normal tracking-tight md:text-3xl">
            Hear it for yourself.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Spin up your first agent and place a real test call — live in an afternoon, no credit card to try.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="btn-ai rounded-full text-primary-foreground">
              <Link href="/get-started">
                Build your first agent <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <RelatedLinks
        heading="Explore 9278.ai"
        description="Features, pricing, and the fastest way to get started."
        links={[
          {
            href: "/features",
            title: "Features",
            description: "Native audio, telephony, integrations, and observability — production-ready.",
          },
          {
            href: "/pricing",
            title: "Pricing",
            description: "Per-second voice billing with monthly or yearly plans — the same live pricing as checkout.",
          },
          {
            href: "/contact",
            title: "Contact us",
            description: "Questions about pricing, a live demo, or partnerships — the team is here.",
          },
        ]}
      />

      <SiteFooter />
    </main>
  )
}
