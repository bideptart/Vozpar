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
} from "lucide-react"
import { motion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

const features = [
  {
    icon: AudioLines,
    title: "Sub-300ms latency",
    description:
      "Real-time WebRTC audio with a globally distributed media network. Conversations feel instant, never delayed.",
  },
  {
    icon: Hand,
    title: "Natural turn-taking",
    description:
      "Smart endpointing, barge-in, and interruption handling let your agent listen, pause, and respond like a person.",
  },
  {
    icon: PhoneCall,
    title: "Carrier-grade telephony",
    description:
      "Inbound and outbound PSTN calling over SIP. Provision DIDs in 60+ countries and route calls intelligently.",
  },
  {
    icon: Languages,
    title: "Multilingual voices",
    description:
      "Speak naturally in dozens of languages and accents. Switch mid-call when your caller does.",
  },
  {
    icon: Wrench,
    title: "Tools & function calling",
    description:
      "Look up CRMs, book calendars, take payments, query inventory — your agent uses the same APIs your team does.",
  },
  {
    icon: Repeat,
    title: "Live transfer & handoff",
    description:
      "Warm-transfer to a human, swap between specialist agents, and pass full context — no repeating the customer.",
  },
  {
    icon: Mic,
    title: "Background noise removal",
    description:
      "AI-powered noise and echo cancellation so callers from a busy street, café, or car still come through cleanly.",
  },
  {
    icon: Activity,
    title: "Live transcripts & analytics",
    description:
      "Every call streamed to text with speaker labels, sentiment, intents, and conversion events — searchable from day one.",
  },
  {
    icon: ShieldCheck,
    title: "Recording, redaction & compliance",
    description:
      "Configurable PII redaction, encrypted storage, retention controls, and SOC 2-aligned infrastructure out of the box.",
  },
  {
    icon: CalendarClock,
    title: "Scheduling & calendars",
    description:
      "Native Google, Outlook, and Calendly integrations. Book, reschedule, and confirm — all over voice.",
  },
  {
    icon: Webhook,
    title: "Webhooks & APIs",
    description:
      "Trigger workflows on call start, transcript chunks, tool calls, or completion. Pipe data into your stack in real time.",
  },
  {
    icon: Network,
    title: "Massive concurrency",
    description:
      "Scale from one call to thousands in parallel without provisioning servers. Burst capacity is built-in.",
  },
]

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden border-t border-border/40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-0 h-[300px] bg-[radial-gradient(60%_60%_at_50%_0%,oklch(0.7_0.2_290/0.04),transparent_70%)]"
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-24 md:px-6 md:py-32">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="ai-pill-magenta">
            <span className="h-1 w-1 rounded-full bg-accent" />
            Features
          </span>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            Everything you need to ship a{" "}
            <span className="text-aurora">real-world voice agent.</span>
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground md:text-lg">
            Real-time audio, telephony, integrations, and observability — production-ready, all in one platform.
          </p>
        </ScrollReveal>

        <StaggerGroup className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <StaggerItem key={f.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="group relative h-full"
                >
                  {/* Soft hover halo behind the item — gives elevation without a box */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/[0.07] via-transparent to-accent/[0.07] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                  />
                  {/* Subtle accent rule under the title — appears on hover */}
                  <div className="relative flex items-start gap-4">
                    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/15 transition-all duration-300 group-hover:ring-primary/40">
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-xl bg-primary/0 blur-lg transition-all duration-500 group-hover:bg-primary/30"
                      />
                      <Icon
                        className="relative h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                        aria-hidden="true"
                      />
                    </span>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold tracking-tight transition-colors group-hover:text-primary">
                        {f.title}
                      </h3>
                      <span
                        aria-hidden
                        className="mt-2 block h-px w-0 bg-gradient-to-r from-primary/60 to-transparent transition-all duration-500 group-hover:w-12"
                      />
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
