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
  Gauge,
  Globe2,
  Clock,
  Headphones,
  Sparkles,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { ElementType } from "react"
import { motion, useInView, animate, useReducedMotion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"
import { MouseGlowCard } from "@/components/animation/mouse-glow-card"

// Card accent rotation — kept to blue-family hues on purpose: these tint
// icons/text/tags directly, and --features-ink resolves to near-white
// inside .features-hero-dark (it's meant for text on a dark surface, not
// as a standalone icon color) which would read as a stray gray card, not
// "black." The black half of the theme comes from the page background.
const ACCENTS = [
  "var(--features-blue)",
  "var(--features-sky)",
  "var(--features-blue-deep)",
  "var(--features-indigo)",
] as const

// Floating icon badges scattered around the hero — small dark-glass chips
// that bob gently, independent phase/duration per badge for an organic
// (not synchronized) feel. Hidden below sm: too little room, would crowd
// the heading on a narrow screen.
const FLOATING_ICONS = [
  { icon: PhoneCall, top: "20%", left: "9%", duration: 5.5, delay: 0 },
  { icon: Mic, top: "68%", left: "14%", duration: 6.2, delay: 0.6 },
  { icon: Globe2, top: "24%", left: "89%", duration: 5.8, delay: 0.3 },
  { icon: Headphones, top: "64%", left: "86%", duration: 6.6, delay: 0.9 },
  { icon: Sparkles, top: "85%", left: "50%", duration: 5, delay: 1.2 },
] as const

const STATS = [
  { icon: Gauge, prefix: "<", target: 300, decimals: 0, suffix: "ms", label: "Round-trip voice latency" },
  { icon: Globe2, prefix: "", target: 60, decimals: 0, suffix: "+", label: "Countries with local numbers" },
  { icon: ShieldCheck, prefix: "", target: 99.95, decimals: 2, suffix: "%", label: "Platform uptime SLA" },
  { icon: Clock, prefix: "", target: 24, decimals: 0, suffix: "/7", label: "Autonomous call handling" },
]

function AnimatedStat({
  icon: Icon,
  prefix,
  target,
  decimals,
  suffix,
  label,
}: {
  icon: ElementType
  prefix: string
  target: number
  decimals: number
  suffix: string
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    })
    return () => controls.stop()
  }, [inView, target])

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 px-4 py-7 text-center">
      <Icon className="h-4 w-4" style={{ color: "var(--features-blue)" }} aria-hidden="true" />
      <span className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </span>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  )
}

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
  const reduced = useReducedMotion()
  return (
    <>
      {/* Hero — fits the viewport on /features. Fixed dark navy/black canvas
          is the "black and blue" theme statement; the rest of the page stays
          on the site's normal light surface with blue/black accents. */}
      <section
        id="features-hero"
        className="features-hero-dark relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden border-t border-border/40"
        style={{ background: "var(--features-hero-bg)" }}
      >
        {/* Drifting glow orbs */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/4 top-0 -z-10 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full blur-[110px] [will-change:transform]"
          style={{ background: "oklch(0.55 0.22 263 / 0.4)" }}
          animate={reduced ? undefined : { x: [0, 50, -20, 0], y: [0, 40, -10, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-1/4 bottom-0 -z-10 h-[22rem] w-[22rem] translate-x-1/3 translate-y-1/3 rounded-full blur-[110px] [will-change:transform]"
          style={{ background: "oklch(0.5 0.24 276 / 0.35)" }}
          animate={reduced ? undefined : { x: [0, -40, 20, 0], y: [0, -30, 15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        {/* Light grid lines for the dark canvas */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(1 0 0 / 0.07) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.07) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {/* Floating icon badges — gentle, independent bob per badge.
            Centering (-translate-x/y-1/2) lives on a plain, non-motion
            wrapper: a motion.div manages `transform` itself for the bob/
            rotate animation and would silently overwrite a Tailwind
            transform utility on the same element (inline style always
            wins), so the two are split across parent/child. */}
        {FLOATING_ICONS.map((f, i) => {
          const Icon = f.icon
          return (
            <div
              key={i}
              aria-hidden
              className="pointer-events-none absolute hidden -translate-x-1/2 -translate-y-1/2 sm:block"
              style={{ top: f.top, left: f.left }}
            >
              <motion.div
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-md"
                style={{ color: "var(--features-blue)" }}
                animate={reduced ? undefined : { y: [0, -14, 0], rotate: [0, 4, 0] }}
                transition={{ duration: f.duration, delay: f.delay, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </motion.div>
            </div>
          )
        })}
        <div className="relative mx-auto w-full max-w-3xl px-4 text-center md:px-6">
          <ScrollReveal>
            <span className="ai-pill-blue">
              <span className="h-1 w-1 rounded-full bg-current" />
              Features
            </span>
            <h1 className="mt-6 text-balance text-4xl font-serif font-normal leading-[1.05] tracking-tight text-white md:text-6xl">
              Everything you need to ship a{" "}
              <span className="text-aurora-blue">real-world voice agent.</span>
            </h1>
            <p className="mt-6 text-pretty leading-relaxed text-slate-300 md:text-lg">
              Real-time audio, telephony, integrations, and observability — production-ready, all in one platform.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats — quick credibility band, counts up into view */}
      <section
        className="features-hero-dark relative border-t border-white/10"
        style={{ background: "var(--features-hero-bg)" }}
      >
        <div className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6 md:py-14">
          <ScrollReveal>
            <div
              className="grid grid-cols-2 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in oklch, var(--features-blue) 10%, transparent), color-mix(in oklch, var(--features-indigo) 10%, transparent))",
              }}
            >
              {STATS.map((s) => (
                <AnimatedStat key={s.label} {...s} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Grid — feature cards, spotlight-card treatment */}
      <section
        id="features"
        className="features-hero-dark relative overflow-hidden border-t border-white/10"
        style={{ background: "var(--features-hero-bg)" }}
      >
        {/* Ambient glow, subtle */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-60 blur-[140px]"
          style={{ background: "oklch(0.4 0.16 263 / 0.25)" }}
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <StaggerGroup className="grid gap-5 sm:grid-cols-2">
          {features.map((f, i) => {
            const Icon = f.icon
            const accent = ACCENTS[i % ACCENTS.length]
            const number = String(i + 1).padStart(2, "0")
            return (
              <StaggerItem key={f.title}>
                <MouseGlowCard
                  glowColor={`color-mix(in oklch, ${accent} 45%, transparent)`}
                  accentColor={accent}
                  className="h-full overflow-hidden border-white/10 bg-white/[0.05] p-6 shadow-lg shadow-black/30 hover:border-white/20 md:p-7"
                >
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
                        className="relative flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
                        style={{
                          background: `color-mix(in oklch, ${accent} 16%, transparent)`,
                          borderColor: `color-mix(in oklch, ${accent} 35%, transparent)`,
                          color: accent,
                        }}
                      >
                        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                      </span>
                      <span
                        aria-hidden
                        className="h-10 w-px bg-gradient-to-b from-white/15 to-transparent"
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                          style={{
                            color: accent,
                            background: `color-mix(in oklch, ${accent} 14%, transparent)`,
                            borderColor: `color-mix(in oklch, ${accent} 32%, transparent)`,
                          }}
                        >
                          {f.tag}
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 -translate-y-0.5 translate-x-1 text-slate-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                          style={{ color: accent }}
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.description}</p>
                    </div>
                  </div>
                </MouseGlowCard>
              </StaggerItem>
            )
          })}
          </StaggerGroup>
        </div>
      </section>
    </>
  )
}
