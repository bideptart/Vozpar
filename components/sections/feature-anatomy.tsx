"use client"

import { useEffect, useRef, useState } from "react"
import type { ElementType } from "react"
import { AudioLines, Building2, Cable, Languages, PhoneCall, Radio, Repeat } from "lucide-react"
import { motion, useReducedMotion } from "@/lib/motion"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { CardStack, type CardStackItem } from "@/components/ui/card-stack"

/**
 * FeatureAnatomy
 * The signal path a call takes — carrier, media edge, agent, language, your
 * APIs, an optional human handoff, and the record written at the end —
 * presented as a fanned deck you move through in order.
 *
 * Deliberately no per-stage millisecond breakdown. A latency budget split
 * across the stages would be a specific engineering claim, and inventing one to
 * fill a diagram is how a marketing page ends up asserting something the
 * platform doesn't do. Every line restates something the site already commits
 * to; the round-trip target stays one end-to-end number.
 */

type Stage = CardStackItem & {
  icon: ElementType
  index: string
  kicker: string
  body: string
  tint: string
  /** The one stage that is the product rather than the plumbing. */
  hero?: boolean
}

const STAGES: Stage[] = [
  {
    id: "carrier",
    icon: Building2,
    index: "01",
    kicker: "Yours",
    title: "Your carrier",
    body: "The SIP trunk you already pay for. Numbers and call charges stay on your account, under your carrier's terms.",
    tint: "var(--features-blue)",
  },
  {
    id: "edge",
    icon: Cable,
    index: "02",
    kicker: "Edge",
    title: "Media edge",
    body: "The call lands on a distributed media network. Noise and echo suppression run here, before anything else hears the audio.",
    tint: "var(--features-blue)",
  },
  {
    id: "agent",
    icon: AudioLines,
    index: "03",
    kicker: "The agent",
    title: "Audio in, audio out",
    body: "No speech-to-text → model → text-to-speech relay in the middle. Endpointing and barge-in run in the same loop, so an interruption lands mid-sentence instead of after the beep.",
    tint: "var(--features-blue-deep)",
    hero: true,
  },
  {
    id: "language",
    icon: Languages,
    index: "04",
    kicker: "Mid-call",
    title: "Speaks their language",
    body: "Detects the caller's language on the first utterance and switches to it mid-call, across dozens of languages and accents.",
    tint: "var(--features-blue)",
  },
  {
    id: "tools",
    icon: Radio,
    index: "05",
    kicker: "Your stack",
    title: "Tool calls, mid-call",
    body: "Calendar, CRM, payments and inventory — called over your own APIs while the caller is still on the line, not queued for afterwards.",
    tint: "var(--features-green)",
  },
  {
    id: "handoff",
    icon: Repeat,
    index: "06",
    kicker: "Optional",
    title: "Handoff, with context",
    body: "Warm-transfer to a human or a specialist agent carrying the full context, so the caller never has to start the story again.",
    tint: "var(--features-amber)",
  },
  {
    id: "caller",
    icon: PhoneCall,
    index: "07",
    kicker: "Caller",
    title: "Reply, then the record",
    body: "The spoken answer goes back down the same path. Transcript, sentiment and detected intents are written into your stack.",
    tint: "var(--features-blue-deep)",
  },
]

/** Configured by the customer, as opposed to fixed by the platform. */
const CONTROLS = ["Prompt & policy", "Voice & language", "Which tools it may call", "Your carrier", "Retention"]

/* ---------------------------------------------------------------------- */

/**
 * Card geometry derived from the measured container. Seeded at a phone width so
 * the server/first render is the layout that fits everywhere and expands, not a
 * five-card fan that paints off-screen for a frame on mobile. All seven cards
 * render at every tier — only the widths and how tightly they tuck change.
 */
function useDeckSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(360)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])

  let cardWidth: number
  let overlap: number
  let spreadDeg: number
  let depthPx: number

  if (width >= 900) {
    // Sized so the outer card lands just inside the container edge. Depth is
    // kept low (100) because the outer card sits at z = −3·depth and the
    // perspective shrinks it, dragging the whole fan inward if depth is large.
    cardWidth = Math.min(420, width / 2.95)
    overlap = 0.58
    spreadDeg = 30
    depthPx = 100
  } else if (width >= 560) {
    cardWidth = Math.min(380, width / 2.0)
    overlap = 0.72
    spreadDeg = 20
    depthPx = 80
  } else {
    // Phones: the card is essentially the whole container and the fan tucks
    // almost flat behind it. Sized any smaller to fit the neighbours on screen,
    // the card drops to ~180px and every body ladders; instead the neighbours
    // run past the edges and the section clips them.
    cardWidth = width - 24
    overlap = 0.88
    spreadDeg = 8
    depthPx = 70
  }

  const stagePadPx = width >= 900 ? 72 : width >= 560 ? 52 : 32

  return {
    cardWidth: Math.round(Math.max(220, cardWidth)),
    cardHeight: 330,
    maxVisible: 7,
    overlap,
    spreadDeg,
    depthPx,
    stagePadPx,
  }
}

/**
 * One stage. The surface is a flat opaque `--card` for every card, hero
 * included — a translucent fill let the cards stacked behind show through, so
 * the deck read as stacked glass. Depth dimming lives on the `scrim` overlay
 * painted over the opaque surface, keyed to how far back the card sits.
 */
function StageCard({ stage, active, offset }: { stage: Stage; active: boolean; offset: number }) {
  const Icon = stage.icon
  const reduced = useReducedMotion()
  const scrim = active ? 0 : Math.min(0.82, 0.5 + Math.abs(offset) * 0.16)
  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden p-6 transition-colors duration-300"
      style={{
        background: "var(--card)",
        boxShadow: active ? `inset 0 0 0 1px color-mix(in srgb, ${stage.tint} 34%, transparent)` : undefined,
      }}
    >
      {/* Side lights — the active card's left and right edges glow and breathe
          in the stage's accent. Inside the card's own overflow, so they read as
          light running down the border rather than a halo around it. */}
      {active && (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[3px]"
            style={{ background: `linear-gradient(180deg, transparent, ${stage.tint}, transparent)`, boxShadow: `0 0 16px ${stage.tint}` }}
            initial={{ opacity: 0.5 }}
            animate={reduced ? { opacity: 0.8 } : { opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[3px]"
            style={{ background: `linear-gradient(180deg, transparent, ${stage.tint}, transparent)`, boxShadow: `0 0 16px ${stage.tint}` }}
            initial={{ opacity: 0.5 }}
            animate={reduced ? { opacity: 0.8 } : { opacity: [0.4, 1, 0.4] }}
            // Offset half a cycle so the two sides pulse against each other.
            transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.2 }}
          />
        </>
      )}

      {/* Accent rule along the top edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${stage.tint}, color-mix(in srgb, ${stage.tint} 8%, transparent))`,
          opacity: active ? 1 : 0.35,
        }}
      />

      {/* Depth scrim over the opaque surface */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-background transition-opacity duration-300"
        style={{ opacity: scrim }}
      />

      <div className="relative flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
          style={{
            background: `color-mix(in srgb, ${stage.tint} 18%, transparent)`,
            borderColor: `color-mix(in srgb, ${stage.tint} 34%, transparent)`,
            color: stage.tint,
          }}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: stage.tint }}>
          {stage.index} · {stage.kicker}
        </span>
      </div>

      <h3 className="relative mt-5 font-heading text-xl font-medium leading-snug tracking-[-0.025em] text-foreground">
        {stage.title}
      </h3>
      <p className="relative mt-2.5 text-[13px] font-light leading-relaxed text-muted-foreground">{stage.body}</p>

      {stage.hero && (
        <span
          className="relative mt-auto inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em]"
          style={{
            color: stage.tint,
            borderColor: `color-mix(in srgb, ${stage.tint} 40%, transparent)`,
            background: `color-mix(in srgb, ${stage.tint} 12%, transparent)`,
          }}
        >
          <span
            className={active ? "pulse-ring relative h-1 w-1 rounded-full bg-current" : "h-1 w-1 rounded-full bg-current"}
          />
          Where the half-second is won
        </span>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------------- */

export function FeatureAnatomy() {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const { cardWidth, cardHeight, maxVisible, overlap, spreadDeg, depthPx, stagePadPx } = useDeckSize(stageRef)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section
      className="features-hero-dark relative isolate overflow-hidden border-t border-border"
      style={{ background: "var(--features-hero-bg)" }}
    >
      {/* Ambient glow removed — flat black canvas per the /features theme. */}

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-16">
        <ScrollReveal className="mx-auto mb-6 max-w-2xl text-center md:mb-8">
          <span className="ai-pill-blue">
            <span className="h-1 w-1 rounded-full bg-current" />
            Anatomy of a call
          </span>
          <h2 className="mt-5 text-balance font-heading text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
            One path, end to end.
          </h2>
          <p className="mt-4 text-pretty text-[15px] font-light leading-relaxed text-muted-foreground">
            Most teams assemble this from a speech vendor, a telephony vendor and a pile of glue code — and pay a text
            round-trip in the middle for it. Here is every hop a call actually makes.
          </p>
        </ScrollReveal>

        {/* Progress readout — the deck shows one stage forward at a time, so the
            sequence is stated where the eye can hold it. Phone shows just the
            counter; the title is on the card already. Live region so the swap
            is announced to a screen reader. */}
        <ScrollReveal className="mb-2 flex items-center justify-center gap-3">
          <span
            aria-live="polite"
            aria-atomic="true"
            className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50"
          >
            Stage {STAGES[activeIndex].index} of {String(STAGES.length).padStart(2, "0")}
            <span className="hidden sm:inline"> — {STAGES[activeIndex].title}</span>
          </span>
          <span aria-hidden className="hidden h-px w-16 bg-border sm:block" />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50 sm:block">
            drag to explore
          </span>
        </ScrollReveal>

        <div ref={stageRef}>
          <CardStack
            items={STAGES}
            navLabel="Stages of a call"
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            maxVisible={maxVisible}
            stagePadPx={stagePadPx}
            overlap={overlap}
            spreadDeg={spreadDeg}
            depthPx={depthPx}
            tiltXDeg={8}
            activeLiftPx={18}
            activeScale={1.02}
            inactiveScale={0.93}
            autoAdvance
            intervalMs={6000}
            pauseOnHover
            onChangeIndex={(i) => setActiveIndex(i)}
            renderCard={(stage, { active, offset }) => <StageCard stage={stage} active={active} offset={offset} />}
          />
        </div>

        {/* What the customer configures, as opposed to what's fixed */}
        <ScrollReveal className="mt-8 md:mt-10">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/30 px-5 py-5 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-8 sm:px-6">
            <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
              Yours to configure
            </p>
            <div className="flex flex-wrap gap-2">
              {CONTROLS.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-300 hover:border-white/25 hover:text-foreground"
                >
                  <span aria-hidden className="h-1 w-1 rounded-full" style={{ background: "var(--features-blue)" }} />
                  {c}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
