"use client"

import {
  AudioLines,
  Hand,
  PhoneCall,
  Languages,
  Wrench,
  Repeat,
  ShieldCheck,
  Activity,
  Webhook,
  Mic,
  CalendarClock,
  Network,
  ArrowUpRight,
} from "lucide-react"
import { motion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

const ACCENTS = [
  "var(--ai-cyan)",
  "var(--ai-violet)",
  "var(--ai-magenta)",
  "var(--ai-mint)",
] as const

const features = [
  {
    icon: AudioLines,
    title: "Sub-300ms latency",
    description:
      "Real-time WebRTC audio with a globally distributed media network. Conversations feel instant, never delayed.",
    tag: "Voice",
  },
  {
    icon: Hand,
    title: "Natural turn-taking",
    description:
      "Smart endpointing, barge-in, and interruption handling let your agent listen, pause, and respond like a person.",
    tag: "Voice",
  },
  {
    icon: PhoneCall,
    title: "Carrier-grade telephony",
    description:
      "Inbound and outbound PSTN calling over SIP. Connect your existing carrier and route calls intelligently across 60+ countries.",
    tag: "Telephony",
  },
  {
    icon: Languages,
    title: "Multilingual voices",
    description:
      "Speak naturally in dozens of languages and accents. Auto-detect the caller's language and switch mid-call when they do.",
    tag: "Voice",
  },
  {
    icon: Wrench,
    title: "Tools & function calling",
    description:
      "Look up CRMs, book calendars, take payments, query inventory — your agent uses the same APIs your team does.",
    tag: "Integrations",
  },
  {
    icon: Repeat,
    title: "Live transfer & handoff",
    description:
      "Warm-transfer to a human, swap between specialist agents, and pass full context — no repeating the customer.",
    tag: "Telephony",
  },
  {
    icon: Mic,
    title: "Background noise removal",
    description:
      "AI-powered noise and echo cancellation so callers from a busy street, café, or car still come through cleanly.",
    tag: "Voice",
  },
  {
    icon: Activity,
    title: "Live transcripts & analytics",
    description:
      "Every call streamed to text with speaker labels, sentiment, intents, and conversion events — searchable from day one.",
    tag: "Operations",
  },
  {
    icon: ShieldCheck,
    title: "Recording, redaction & compliance",
    description:
      "Configurable PII redaction, encrypted storage, retention controls, and SOC 2-aligned infrastructure out of the box.",
    tag: "Operations",
  },
  {
    icon: CalendarClock,
    title: "Scheduling & calendars",
    description:
      "Native Google, Outlook, and Calendly integrations. Book, reschedule, and confirm — all over voice.",
    tag: "Integrations",
  },
  {
    icon: Webhook,
    title: "Webhooks & APIs",
    description:
      "Trigger workflows on call start, transcript chunks, tool calls, or completion. Pipe data into your stack in real time.",
    tag: "Integrations",
  },
  {
    icon: Network,
    title: "Massive concurrency",
    description:
      "Scale from one call to thousands in parallel without provisioning servers. Burst capacity is built-in.",
    tag: "Operations",
  },
]

export function Features() {
  return (
    <>
      {/* Hero — fits the viewport on /features */}
      <section
        id="features-hero"
        className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden border-t border-border/40"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,oklch(0.7_0.2_290/0.06),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="relative mx-auto w-full max-w-3xl px-4 text-center md:px-6">
          <ScrollReveal>
            <span className="ai-pill-magenta">
              <span className="h-1 w-1 rounded-full bg-accent" />
              Features
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Everything you need to ship a{" "}
              <span className="text-aurora">real-world voice agent.</span>
            </h1>
            <p className="mt-6 text-pretty leading-relaxed text-muted-foreground md:text-lg">
              Real-time audio, telephony, integrations, and observability — production-ready, all in one platform.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Grid — feature cards */}
      <section id="features" className="relative overflow-hidden border-t border-border/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <StaggerGroup className="grid gap-5 sm:grid-cols-2">
          {features.map((f, i) => {
            const Icon = f.icon
            const accent = ACCENTS[i % ACCENTS.length]
            const number = String(i + 1).padStart(2, "0")
            return (
              <StaggerItem key={f.title}>
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-6 backdrop-blur-md transition-colors hover:border-border/80 md:p-7"
                >
                  {/* Left accent bar */}
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-[3px] origin-bottom scale-y-50 transition-transform duration-500 group-hover:scale-y-100"
                    style={{ background: `linear-gradient(180deg, transparent, ${accent}, transparent)` }}
                  />
                  {/* Soft accent glow on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-[80px] transition-opacity duration-500 group-hover:opacity-40"
                    style={{ background: accent }}
                  />

                  <div className="relative flex items-start gap-5">
                    {/* Big numeric / icon block */}
                    <div className="relative flex shrink-0 flex-col items-center gap-2">
                      <span
                        className="font-mono text-[11px] font-medium uppercase tracking-[0.22em]"
                        style={{ color: accent }}
                      >
                        {number}
                      </span>
                      <span
                        className="relative flex h-12 w-12 items-center justify-center rounded-2xl ring-1"
                        style={{
                          background: `color-mix(in oklch, ${accent} 12%, transparent)`,
                          borderColor: `color-mix(in oklch, ${accent} 30%, transparent)`,
                          color: accent,
                        }}
                      >
                        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                      </span>
                      <span
                        aria-hidden
                        className="h-10 w-px bg-gradient-to-b from-border/60 to-transparent"
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                          style={{
                            color: accent,
                            background: `color-mix(in oklch, ${accent} 10%, transparent)`,
                            borderColor: `color-mix(in oklch, ${accent} 28%, transparent)`,
                          }}
                        >
                          {f.tag}
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 -translate-y-0.5 translate-x-1 text-muted-foreground/60 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                          style={{ color: accent }}
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="mt-3 text-lg font-semibold tracking-tight">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                    </div>
                  </div>
                </motion.article>
              </StaggerItem>
            )
          })}
          </StaggerGroup>
        </div>
      </section>
    </>
  )
}
