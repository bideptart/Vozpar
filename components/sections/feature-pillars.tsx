"use client"

import { AudioLines, PhoneCall, BrainCircuit, Check } from "lucide-react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"
import { MouseGlowCard } from "@/components/animation/mouse-glow-card"

/**
 * FeaturePillars
 * Groups the 12 individual features into the three stories buyers
 * actually evaluate: does it sound human, can it handle real phone
 * traffic, and can it act on what it hears.
 */

const PILLARS = [
  {
    icon: AudioLines,
    accent: "var(--features-blue)", // #2F8FE0
    kicker: "Sounds human",
    title: "Conversation quality",
    body: "The half-second that decides whether a caller stays on the line. Native audio in, native audio out — no text bottleneck in the middle.",
    points: [
      "Sub-300ms round-trip response",
      "Barge-in and natural turn-taking",
      "Dozens of languages and accents",
      "Noise and echo suppression",
    ],
  },
  {
    icon: PhoneCall,
    accent: "var(--features-blue-deep)", // #1E6FD6
    kicker: "Handles real traffic",
    title: "Telephony that scales",
    body: "Bring the carrier you already pay for. Route, transfer, and burst to thousands of concurrent calls without provisioning a thing.",
    points: [
      "Inbound and outbound PSTN over SIP",
      "Local numbers across 60+ countries",
      "Warm transfer with full context",
      "Unlimited parallel calls",
    ],
  },
  {
    icon: BrainCircuit,
    accent: "var(--features-green)", // #1F9D55
    kicker: "Acts on what it hears",
    title: "Intelligence and control",
    body: "An agent that only talks is a voicemail box. Yours books, updates, charges, and hands you the transcript to prove it.",
    points: [
      "Live tool and function calling",
      "Calendar and CRM writebacks",
      "Transcripts, sentiment, and intents",
      "PII redaction and retention controls",
    ],
  },
] as const

export function FeaturePillars() {
  return (
    <section
      className="features-hero-dark relative overflow-hidden border-t border-border"
      style={{ background: "var(--features-hero-bg)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[30rem] w-[30rem] translate-x-1/3 rounded-full opacity-50 blur-[130px]"
        style={{ background: "color-mix(in srgb, var(--features-blue-deep) 30%, transparent)" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <ScrollReveal className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <span className="ai-pill-blue">
            <span className="h-1 w-1 rounded-full bg-current" />
            How it fits together
          </span>
          <h2 className="mt-5 text-balance font-heading text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
            Three layers, working as one call.
          </h2>
          <p className="mt-4 text-pretty text-[15px] font-light leading-relaxed text-muted-foreground">
            Most teams assemble this from a speech vendor, a telephony vendor, and a pile of glue code. Here it ships
            as a single platform.
          </p>
        </ScrollReveal>

        <StaggerGroup className="grid gap-4 sm:gap-5 lg:grid-cols-3">
          {PILLARS.map((p) => {
            const Icon = p.icon
            return (
              <StaggerItem key={p.title}>
                <MouseGlowCard
                  glowColor={`color-mix(in srgb, ${p.accent} 40%, transparent)`}
                  accentColor={p.accent}
                  className="h-full rounded-2xl border-border bg-card/60 p-6 shadow-lg shadow-black/20 hover:border-white/25 sm:p-7 md:p-8"
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
                    style={{
                      background: `color-mix(in srgb, ${p.accent} 16%, transparent)`,
                      borderColor: `color-mix(in srgb, ${p.accent} 35%, transparent)`,
                      color: p.accent,
                    }}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  {/* Eyebrow — monospace, uppercase */}
                  <p
                    className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: p.accent }}
                  >
                    {p.kicker}
                  </p>
                  {/* H3 — Archivo 500, −0.75px tracking */}
                  <h3 className="mt-2 font-heading text-xl font-medium leading-[1.2] tracking-[-0.025em] text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[15px] font-light leading-relaxed text-muted-foreground">{p.body}</p>

                  <ul className="mt-6 space-y-2.5 border-t border-border pt-5">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-sm leading-[1.4] text-muted-foreground">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0"
                          style={{ color: p.accent }}
                          aria-hidden="true"
                        />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </MouseGlowCard>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
