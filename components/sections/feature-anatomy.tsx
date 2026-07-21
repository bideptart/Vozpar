"use client"

import { useEffect, useRef, useState } from "react"
import type { ElementType } from "react"
import { AudioLines, Building2, Cable, Languages, PhoneCall, Radio, Repeat } from "lucide-react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { CardStack, type CardStackItem } from "@/components/ui/card-stack"

/**
 * FeatureAnatomy
 * The signal path a call takes — carrier, media edge, agent, language, your
 * APIs, an optional human handoff, and the record written at the end —
 * presented as a fanned deck you move through in order.
 *
 * Why a deck rather than the five-across chain this replaced: equal cards in a
 * row is a list, and it forced every stage into ~140px of text at xl and a
 * 2+2+1 orphan grid below that. The deck gives the active stage a full card and
 * keeps the sequence legible through the numbering and the fan order, at the
 * cost of only showing one stage at a time — which is the trade being made
 * deliberately here.
 *
 * Deliberately no per-stage millisecond breakdown. A latency budget split
 * across the stages would be a specific engineering claim, and inventing one
 * to fill a diagram is how a marketing page ends up asserting something the
 * platform doesn't do. Every line restates something the site already commits
 * to; the round-trip target stays one end-to-end number, which is the one
 * that's actually measured.
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
 * Card geometry derived from the measured container.
 *
 * Starts at a fixed desktop default and only measures after mount — reading
 * `window` during render would give the server one size and the client
 * another, which is a hydration mismatch on an inline style.
 *
 * The sizes are solved backwards from the fan's footprint rather than picked
 * by eye. A card at offset n sits at `n · cardSpacing` with `cardSpacing =
 * cardWidth · (1 − overlap)`, and rotating it by `spreadDeg` widens its
 * bounding box to roughly `0.6 · cardWidth`. So the fan needs
 *
 *     maxOffset · (1 − overlap) · cardWidth + 0.6 · cardWidth  ≤  container / 2
 *
 * Sized by eye instead, a 400px card with two neighbours each side needed a
 * 1255px container — it fitted at 1280px viewport and was clipped by 52px at
 * 1152 and 244px at 768, where the outer cards were most of the way off the
 * screen. Card COUNT is what gives way as the container narrows, not just size.
 */
function useDeckSize(ref: React.RefObject<HTMLDivElement | null>) {
  // Seeded at a phone width on purpose. This is what the server and the first
  // client render use, before the observer has measured anything. Seeded at a
  // desktop width instead, a phone painted a five-card fan ~250px off each
  // edge for a frame before collapsing. It's also the layout a no-JS visitor
  // keeps, since the observer never runs for them — better that they get the
  // tucked deck than a five-card fan they can't scroll to see.
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

  let maxVisible: number
  let cardWidth: number
  let overlap: number
  let spreadDeg: number

  if (width >= 900) {
    maxVisible = 5
    cardWidth = Math.min(380, width / 3.2)
    overlap = 0.52
    spreadDeg = 34
  } else if (width >= 560) {
    maxVisible = 3
    cardWidth = Math.min(340, width / 2.3)
    overlap = 0.52
    spreadDeg = 22
  } else {
    // Phones keep the fan, tucked: neighbours sit almost entirely behind the
    // active card (0.80 overlap against 0.52) with 12° of splay against 34°.
    // Solved the other way — a fan sized to fit entirely inside 288px — the
    // cards come out ~180px wide, leaving ~130px of text and laddering every
    // body. So the side cards are allowed to run past the edges instead; the
    // section clips them, and at 0.7 opacity a partly off-screen neighbour
    // reads as "there's more", which is the whole point of a deck.
    maxVisible = 3
    cardWidth = width - 60
    overlap = 0.8
    spreadDeg = 12
  }

  // Height stays constant across tiers. It's derived from the container, and
  // the container is only measured after mount — a height that moved with it
  // would shift the page on every load. Headroom does scale, since a wide
  // splay needs room for the lift and tilt and a tucked one barely any.
  const stagePadPx = maxVisible > 3 ? 72 : width >= 560 ? 52 : 36

  return {
    cardWidth: Math.round(Math.max(220, cardWidth)),
    cardHeight: 330,
    maxVisible,
    overlap,
    spreadDeg,
    stagePadPx,
  }
}

/**
 * One stage.
 *
 * The background is a flat opaque `--card` for every stage, hero included.
 * The hero previously used a gradient whose first stop was
 * `color-mix(tint 18%, transparent)` — 82% transparent — so the fanned cards
 * stacked behind it showed straight through the top-left corner and their
 * rotated text printed over the copy. In a deck, card surfaces have to be
 * opaque; accent belongs on the border and the rule, not in the fill.
 */
function StageCard({ stage, active }: { stage: Stage; active: boolean }) {
  const Icon = stage.icon
  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden p-6 transition-colors duration-300"
      style={{
        background: "var(--card)",
        boxShadow: active ? `inset 0 0 0 1px color-mix(in srgb, ${stage.tint} 34%, transparent)` : undefined,
      }}
    >
      {/* Accent rule along the top edge — the only tint on the surface */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${stage.tint}, color-mix(in srgb, ${stage.tint} 8%, transparent))`,
          opacity: active ? 1 : 0.35,
        }}
      />

      {/* Cards behind the active one recede rather than compete. Without this
          the deck reads as a pile of equally-loud cards overlapping. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-background transition-opacity duration-300"
        style={{ opacity: active ? 0 : 0.55 }}
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
          {stage.kicker}
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
          <span className={active ? "pulse-ring relative h-1 w-1 rounded-full bg-current" : "h-1 w-1 rounded-full bg-current"} />
          Where the half-second is won
        </span>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------------- */

export function FeatureAnatomy() {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const { cardWidth, cardHeight, maxVisible, overlap, spreadDeg, stagePadPx } = useDeckSize(stageRef)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section
      className="features-hero-dark relative isolate overflow-hidden border-t border-border"
      style={{ background: "var(--features-hero-bg)" }}
    >
      <div
        aria-hidden
        className="drift-blob pointer-events-none absolute right-0 top-0 -z-10 h-[30rem] w-[30rem] translate-x-1/3 rounded-full opacity-50 blur-[130px]"
        style={{ background: "color-mix(in srgb, var(--features-blue-deep) 30%, transparent)" }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <ScrollReveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
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

        {/* Progress readout — the deck shows one stage at a time, so the
            sequence has to be stated somewhere the eye can hold it. */}
        {/* Readout. On a phone this is the counter alone: with the stage title
            appended and "drag to explore" sitting beside it, the row wrapped to
            two lines and the two halves collided. The card underneath already
            shows the title, so on mobile it's pure duplication — but the live
            region still needs it, hence `sm:inline` rather than dropping it
            from the DOM. */}
        <ScrollReveal className="mb-2 flex items-center justify-center gap-3">
          {/* Polite, not assertive: the deck advances on its own every six
              seconds, and an assertive region would interrupt a screen reader
              mid-sentence each time. */}
          <span
            aria-live="polite"
            aria-atomic="true"
            className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50"
          >
            {/* "Stage", not "Hop": two of the seven (language detection and the
                human handoff) are things a call may do, not things every call
                does, and numbering them as mandatory hops overstated it. */}
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
            depthPx={130}
            tiltXDeg={8}
            activeLiftPx={18}
            activeScale={1.02}
            inactiveScale={0.93}
            // Autoplay is only defensible because CardStack ships a real pause
            // button beside the dots — WCAG 2.2.2 needs a mechanism, and
            // `pauseOnHover` isn't one (it doesn't exist on touch). Six seconds
            // is set against the longest card: stage 03 runs ~170 characters,
            // which is roughly five seconds of reading.
            autoAdvance
            intervalMs={6000}
            pauseOnHover
            onChangeIndex={(i) => setActiveIndex(i)}
            renderCard={(stage, { active }) => <StageCard stage={stage} active={active} />}
          />
        </div>

        {/* What the customer configures, as opposed to what's fixed */}
        <ScrollReveal className="mt-8 md:mt-10">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/40 px-5 py-5 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-8 sm:px-6">
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
