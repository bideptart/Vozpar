"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react"
import { Plug, Zap } from "lucide-react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

/**
 * FeatureIntegrations
 * The systems an agent reads from and writes back to, rendered as four
 * continuously moving rails feeding a single agent core.
 *
 * Why rails instead of a static grid: a grid of twenty tiles is a list, and a
 * list reads as "here are some logos". Belts that never stop moving read as
 * traffic — which is the actual claim being made, that these are live
 * connections rather than a compatibility chart. Alternating direction per
 * rail keeps it from looking like one belt cloned four times.
 *
 * Colour discipline: every tint is one of the four brand aliases
 * (--features-blue / -blue-deep / -green / -amber) mapped to a category.
 * Deliberately no third-party brand colours — twenty vendor palettes would
 * pull the section off the brand reference, and monograms stand in for logos
 * so the page isn't shipping two dozen trademarks.
 *
 * The board keeps the original scroll-tilt: it needs `perspective` on an
 * ancestor, otherwise rotateX just squashes it flat instead of reading as
 * depth.
 */

type Kind = "crm" | "comms" | "infra" | "data"

const KIND_ACCENT: Record<Kind, string> = {
  crm: "var(--features-blue)", // #2F8FE0
  comms: "var(--features-blue-deep)", // #1E6FD6
  infra: "var(--features-green)", // #1F9D55
  data: "var(--features-amber)", // #F2A71B
}

const KIND_LABEL: Record<Kind, string> = {
  crm: "CRM",
  comms: "Comms",
  infra: "Infra",
  data: "Data",
}

type Item = { name: string; kind: Kind }

const RAILS: { kind: Kind; label: string; items: string[] }[] = [
  { kind: "crm", label: "CRM & support", items: ["Salesforce", "HubSpot", "Zendesk", "Intercom", "Pipedrive", "Gong"] },
  { kind: "comms", label: "Calendars & comms", items: ["Google Calendar", "Outlook", "Calendly", "Slack"] },
  {
    kind: "infra",
    label: "Telephony & payments",
    items: ["Twilio", "Telnyx", "Vonage", "Stripe", "Zapier", "Webhooks"],
  },
  { kind: "data", label: "Data & warehouse", items: ["Segment", "Snowflake", "BigQuery", "Postgres"] },
]

const TOTAL = RAILS.reduce((n, r) => n + r.items.length, 0)

/**
 * A marquee loop that translates by -50% needs its track to be at least twice
 * the container width, or the seam becomes visible as a gap. The four-item
 * rails can't manage that on a wide screen, so pad each rail out to a floor
 * before the track gets duplicated.
 */
function fill(names: string[], min = 9): string[] {
  const out: string[] = []
  while (out.length < min) out.push(...names)
  return out
}

/* ---------------------------------------------------------------------- */

/**
 * Deliberately cheap to paint: no backdrop-blur and no keyframed pulse on the
 * chip itself. The rails render ~90 of these at once, and per-chip blur plus
 * per-chip animation on top of four running marquees is what would turn this
 * section into a scroll-jank generator. The board behind them is already
 * blurred, so it buys nothing visually anyway.
 */
function Chip({ item }: { item: Item }) {
  const accent = KIND_ACCENT[item.kind]
  return (
    <div className="group/chip relative flex shrink-0 items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card/70 py-2.5 pl-2.5 pr-4 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-white/25">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/chip:opacity-100"
        style={{
          background: `radial-gradient(130% 100% at 0% 0%, color-mix(in srgb, ${accent} 26%, transparent), transparent 70%)`,
        }}
      />

      {/* Monogram in place of a logo — carries the category colour and weight
          without shipping the trademark. */}
      <span
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-medium transition-transform duration-300 group-hover/chip:-rotate-6 group-hover/chip:scale-105"
        style={{
          background: `linear-gradient(150deg, color-mix(in srgb, ${accent} 26%, transparent), color-mix(in srgb, ${accent} 8%, transparent))`,
          borderColor: `color-mix(in srgb, ${accent} 32%, transparent)`,
          color: accent,
        }}
      >
        {item.name.charAt(0)}
      </span>

      <span className="relative flex min-w-0 flex-col">
        <span className="whitespace-nowrap text-[13px] leading-tight text-muted-foreground transition-colors duration-300 group-hover/chip:text-foreground">
          {item.name}
        </span>
        <span className="font-mono text-[9px] uppercase leading-tight tracking-[0.14em] text-muted-foreground/50">
          {KIND_LABEL[item.kind]}
        </span>
      </span>

      <span
        aria-hidden
        className="relative ml-1 h-1.5 w-1.5 shrink-0 rounded-full opacity-70 transition-opacity duration-300 group-hover/chip:opacity-100"
        style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
      />
    </div>
  )
}

function Rail({
  kind,
  items,
  reverse,
  duration,
  reduced,
}: {
  kind: Kind
  items: string[]
  reverse: boolean
  duration: number
  reduced: boolean | null
}) {
  const track = fill(items)
  const doubled = [...track, ...track]
  const fade = "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)"

  return (
    <div
      className="relative overflow-hidden py-1"
      style={{ maskImage: fade, WebkitMaskImage: fade }}
    >
      <div
        className={
          reduced ? "flex w-max gap-3" : `flex w-max gap-3 ${reverse ? "marquee-reverse" : "marquee"}`
        }
        style={reduced ? undefined : { animationDuration: `${duration}s` }}
      >
        {doubled.map((name, i) => (
          <Chip key={`${kind}-${i}`} item={{ name, kind }} />
        ))}
      </div>
    </div>
  )
}

/** The node every rail is feeding. Sits half-outside the board's top edge. */
function AgentCore({ reduced }: { reduced: boolean | null }) {
  return (
    <div className="relative z-10 flex flex-col items-center">
      <div className="relative">
        {/* Concentric emitters — three rings on staggered delays so the pulse
            reads as continuous rather than as one ring blinking. */}
        {!reduced &&
          [0, 0.8, 1.6].map((delay) => (
            <motion.span
              key={delay}
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl border"
              style={{ borderColor: "color-mix(in srgb, var(--features-blue) 45%, transparent)" }}
              initial={{ scale: 1, opacity: 0.55 }}
              animate={{ scale: 1.9, opacity: 0 }}
              transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, delay, ease: "easeOut" }}
            />
          ))}

        <div
          className="relative flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl shadow-black/40 backdrop-blur-md"
          style={{
            borderColor: "color-mix(in srgb, var(--features-blue) 40%, transparent)",
            background:
              "linear-gradient(150deg, color-mix(in srgb, var(--features-blue) 18%, transparent), color-mix(in srgb, var(--features-navy) 60%, transparent))",
          }}
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: "color-mix(in srgb, var(--features-blue) 22%, transparent)" }}
          >
            <Zap className="h-4 w-4" style={{ color: "var(--features-blue)" }} aria-hidden />
          </span>
          <span className="flex flex-col">
            <span className="font-heading text-sm font-medium tracking-[-0.02em] text-foreground">Your agent</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/70">
              Mid-call · reads &amp; writes
            </span>
          </span>
        </div>
      </div>

      {/* Feed line down into the board, with a packet running the length of it */}
      <div className="relative h-10 w-px overflow-hidden">
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--features-blue) 60%, transparent), transparent)",
          }}
        />
        {!reduced && (
          <motion.span
            aria-hidden
            className="absolute left-1/2 h-3 w-[3px] -translate-x-1/2 rounded-full"
            style={{ background: "var(--features-blue)", boxShadow: "0 0 10px var(--features-blue)" }}
            initial={{ y: -12 }}
            animate={{ y: 44 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeIn" }}
          />
        )}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------- */

export function FeatureIntegrations() {
  const reduced = useReducedMotion()
  const boardRef = useRef<HTMLDivElement | null>(null)

  // "start end" → board top hits viewport bottom; "end start" → board bottom
  // leaves viewport top. 0.5 is roughly centred.
  const { scrollYProgress } = useScroll({ target: boardRef, offset: ["start end", "end start"] })
  const rotateX = useTransform(scrollYProgress, [0, 0.4, 0.66, 1], [16, 0, 0, -12])
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.66, 1], [0.95, 1, 1, 0.97])
  const y = useTransform(scrollYProgress, [0, 0.4, 0.66, 1], [40, 0, 0, -24])

  return (
    <section
      className="features-hero-dark relative overflow-hidden border-t border-border"
      style={{ background: "var(--features-hero-bg)" }}
    >
      <div
        aria-hidden
        className="drift-blob pointer-events-none absolute left-1/2 top-0 h-[26rem] w-[40rem] -translate-x-1/2 rounded-full opacity-40 blur-[140px]"
        style={{ background: "color-mix(in srgb, var(--features-blue) 28%, transparent)" }}
      />
      <div
        aria-hidden
        className="drift-blob pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full opacity-30 blur-[130px]"
        style={{ background: "color-mix(in srgb, var(--features-green) 24%, transparent)", animationDelay: "-7s" }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <ScrollReveal className="mx-auto mb-10 max-w-2xl text-center">
          <span className="ai-pill-blue">
            <span className="h-1 w-1 rounded-full bg-current" />
            Integrations
          </span>
          <h2 className="mt-5 text-balance font-heading text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
            Plugs into the stack you already run.
          </h2>
          <p className="mt-4 text-pretty text-[15px] font-light leading-relaxed text-muted-foreground">
            Your agent calls the same APIs your team does — over native integrations, webhooks, or any HTTP endpoint
            you point it at.
          </p>
        </ScrollReveal>

        <ScrollReveal className="flex justify-center">
          <AgentCore reduced={reduced} />
        </ScrollReveal>

        {/* Perspective ancestor — without it the rotateX below flattens the
            board instead of tilting it. */}
        <div className="-mt-4 [perspective:1600px] [transform-style:preserve-3d]">
          <motion.div
            ref={boardRef}
            style={reduced ? undefined : { rotateX, scale, y, willChange: "transform" }}
            className="relative overflow-hidden rounded-3xl border border-border bg-card/40 shadow-2xl shadow-black/40 backdrop-blur-md"
          >
            {/* Faint engineering grid behind the rails */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "linear-gradient(color-mix(in srgb, var(--features-blue) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--features-blue) 8%, transparent) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            />

            <div className="relative flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
              <span className="inline-flex items-center gap-2">
                <span
                  className="pulse-ring relative h-1.5 w-1.5 rounded-full"
                  style={{ color: "var(--features-green)", background: "var(--features-green)" }}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                  Live connections
                </span>
              </span>
              {/* Hidden below sm: at 320px this and the "Live connections"
                  label together need ~342px against 256px available, so both
                  wrapped to two lines inside a one-line-tall header strip. */}
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/50 sm:inline">
                {TOTAL} native · ∞ via webhook
              </span>
            </div>

            <div className="relative space-y-2 py-5 sm:space-y-3 sm:py-6">
              {RAILS.map((rail, i) => (
                <div key={rail.kind} className="flex items-center gap-4">
                  {/* Category gutter — desktop only; on a phone the chips
                      already carry their own category label. */}
                  <span className="hidden w-40 shrink-0 items-center gap-2 pl-6 lg:flex">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: KIND_ACCENT[rail.kind] }}
                    />
                    <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.14em] text-muted-foreground/60">
                      {rail.label}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <Rail
                      kind={rail.kind}
                      items={rail.items}
                      reverse={i % 2 === 1}
                      duration={38 + i * 7}
                      reduced={reduced}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <ScrollReveal className="mt-10 md:mt-12">
          {/* Legend doubles as the mobile key for the gutter labels the board
              hides below lg. */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:hidden">
            {RAILS.map((r) => (
              <span key={r.kind} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: KIND_ACCENT[r.kind] }} />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                  {r.label}
                </span>
              </span>
            ))}
          </div>

          <div className="mt-6 flex justify-center lg:mt-0">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/50 px-4 py-2 backdrop-blur-sm">
              <Plug className="h-3.5 w-3.5" style={{ color: "var(--features-blue)" }} aria-hidden />
              <span className="text-xs font-light text-muted-foreground">
                Don&apos;t see yours? Anything with an API works — point a tool call at it.
              </span>
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
