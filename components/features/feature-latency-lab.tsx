"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Gauge, RotateCcw } from "lucide-react"
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

/**
 * FeatureLatencyLab
 * "Sub-300ms" is a number nobody has intuition for. This lets you drag it.
 *
 * A two-line exchange loops continuously; the silence between the caller
 * finishing and the agent replying is exactly the latency you've dialled in,
 * with a counter ticking up through it. At 280ms you barely notice. At two
 * seconds the dead air is the loudest thing on the page — which is the point.
 *
 * The slider is logarithmic. On a linear 120–3000ms track the entire region
 * anyone actually cares about (roughly 150–600ms) is squashed into the first
 * sixth of the travel, so you can't land on a value deliberately.
 */

const MIN_MS = 120
const MAX_MS = 3000
const RATIO = MAX_MS / MIN_MS
const LN_RATIO = Math.log(RATIO)

/** slider position (0–1000) → milliseconds */
function posToMs(pos: number) {
  return Math.round((MIN_MS * Math.pow(RATIO, pos / 1000)) / 10) * 10
}
/** milliseconds → slider position (0–1000) */
function msToPos(ms: number) {
  return Math.round((Math.log(ms / MIN_MS) / LN_RATIO) * 1000)
}
/** milliseconds → percentage along the track */
function msToPct(ms: number) {
  return (Math.log(ms / MIN_MS) / LN_RATIO) * 100
}

const DEFAULT_POS = msToPos(280)

/** Speaking durations either side of the gap, in seconds. */
const CALLER_S = 1.6
const AGENT_S = 1.9
const REST_S = 0.7

const MARKS = [
  { ms: 200, label: "200ms", sub: "human pause" },
  { ms: 300, label: "300ms", sub: "Vozpar ceiling" },
  { ms: 1200, label: "1.2s", sub: "stitched stack" },
]

type Band = { name: string; tint: string; copy: string }

function bandFor(ms: number): Band {
  if (ms <= 350)
    return {
      name: "Feels human",
      tint: "var(--features-green)",
      copy: "Inside the range of a natural conversational pause. Callers don't register a gap at all — they just talk.",
    }
  if (ms <= 700)
    return {
      name: "Slight lag",
      tint: "var(--features-blue)",
      copy: "A beat of hesitation before every reply. Nobody complains, but the rhythm is subtly off the whole call.",
    }
  if (ms <= 1400)
    return {
      name: "Awkward",
      tint: "var(--features-amber)",
      copy: 'Long enough that callers say "hello?" into the silence — then talk over the reply when it finally lands.',
    }
  return {
    name: "Falls apart",
    tint: "var(--destructive)",
    copy: "Callers assume the line dropped. They repeat themselves, interrupt, or simply hang up and phone a competitor.",
  }
}

const loop = Number.POSITIVE_INFINITY

export function FeatureLatencyLab() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { margin: "-120px" })

  const [pos, setPos] = useState(DEFAULT_POS)
  const ms = posToMs(pos)
  const band = useMemo(() => bandFor(ms), [ms])

  const gapS = ms / 1000
  const cycle = CALLER_S + gapS + AGENT_S + REST_S

  /* ---- looping playhead ------------------------------------------------ */
  const [phase, setPhase] = useState(0)
  const rafRef = useRef<number | null>(null)
  const originRef = useRef(0)
  // The rAF loop below subscribes only to [reduced, inView], so it reads the
  // current cycle length through a ref — updated in its own effect rather than
  // mutated during render, which concurrent rendering doesn't guarantee.
  const cycleRef = useRef(cycle)
  useEffect(() => {
    cycleRef.current = cycle
  }, [cycle])

  useEffect(() => {
    if (reduced || !inView) return
    originRef.current = performance.now()
    const tick = (now: number) => {
      setPhase(((now - originRef.current) / 1000) % cycleRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [reduced, inView])

  const stage: "caller" | "gap" | "agent" | "rest" = reduced
    ? "agent"
    : phase < CALLER_S
      ? "caller"
      : phase < CALLER_S + gapS
        ? "gap"
        : phase < CALLER_S + gapS + AGENT_S
          ? "agent"
          : "rest"

  const gapElapsed = stage === "gap" ? Math.round((phase - CALLER_S) * 1000) : 0

  /* ---- "snap back to Vozpar" ------------------------------------------ */
  const animRef = useRef<number | null>(null)
  const reset = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    const from = pos
    const start = performance.now()
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 500)
      // easeOutExpo — decisive, arrives rather than drifts
      const eased = k === 1 ? 1 : 1 - Math.pow(2, -10 * k)
      setPos(Math.round(from + (DEFAULT_POS - from) * eased))
      if (k < 1) animRef.current = requestAnimationFrame(step)
    }
    animRef.current = requestAnimationFrame(step)
  }, [pos])

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current) }, [])

  const pct = (v: number) => (v / cycle) * 100

  return (
    <section
      ref={ref}
      className="features-hero-dark relative overflow-hidden border-t border-border"
      style={{ background: "var(--features-hero-bg)" }}
    >
      {/* Ambient glow removed — flat black canvas per the /features theme. */}

      <div className="relative mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 md:py-16">
        <ScrollReveal className="mx-auto mb-6 max-w-2xl text-center md:mb-8">
          <span className="ai-pill-blue">
            <span className="h-1 w-1 rounded-full bg-current" />
            Latency lab
          </span>
          <h2 className="mt-5 text-balance font-heading text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
            Drag the delay. Hear the difference.
          </h2>
          <p className="mt-4 text-pretty text-[15px] font-light leading-relaxed text-muted-foreground">
            Every voice platform quotes a latency number. This is what those numbers feel like from the caller&apos;s
            side of the line.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div
            className="relative overflow-hidden rounded-2xl border bg-card/30 p-5 shadow-xl shadow-black/30 backdrop-blur-md transition-colors duration-500 sm:p-6 md:p-7"
            style={{ borderColor: `color-mix(in srgb, ${band.tint} 30%, transparent)` }}
          >
            {/* Two columns from lg: the readout and the exchange on the left,
                the control and the evidence on the right. Stacked, this card ran
                ~600px on desktop and the slider — the one thing you're meant to
                touch — sat below the fold of its own section. */}
            <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col">
            {/* ---- readout ---- */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                  Response latency
                </p>
                <p
                  className="mt-1 font-heading text-4xl font-medium tabular-nums leading-none tracking-[-0.035em] transition-colors duration-300 sm:text-5xl md:text-6xl"
                  style={{ color: band.tint }}
                >
                  {ms}
                  <span className="ml-1 text-xl font-light text-muted-foreground sm:text-2xl">ms</span>
                </p>
              </div>
              <motion.span
                key={band.name}
                initial={reduced ? false : { opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium"
                style={{
                  color: band.tint,
                  borderColor: `color-mix(in srgb, ${band.tint} 40%, transparent)`,
                  background: `color-mix(in srgb, ${band.tint} 12%, transparent)`,
                }}
              >
                <Gauge className="h-4 w-4" aria-hidden />
                {band.name}
              </motion.span>
            </div>

            {/* ---- the exchange ---- */}
            <div className="mt-4 space-y-2">
              {/* Caller */}
              <div className="flex justify-end">
                <motion.p
                  animate={{ opacity: stage === "caller" ? 1 : 0.45 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-[80%] rounded-2xl border border-border bg-white/[0.04] px-4 py-2.5 text-right text-[14px] leading-relaxed text-muted-foreground"
                >
                  Do you have anything Thursday afternoon?
                </motion.p>
              </div>

              {/* Dead air — the star of the section */}
              <div className="flex h-10 items-center justify-center">
                <AnimatePresence mode="wait">
                  {stage === "gap" ? (
                    <motion.span
                      key="gap"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.18 }}
                      className="inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5"
                      style={{
                        borderColor: `color-mix(in srgb, ${band.tint} 45%, transparent)`,
                        background: `color-mix(in srgb, ${band.tint} 10%, transparent)`,
                      }}
                    >
                      <motion.span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: band.tint }}
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 0.6, repeat: loop, ease: "easeInOut" }}
                      />
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">
                        dead air
                      </span>
                      <span
                        className="font-heading text-sm font-medium tabular-nums"
                        style={{ color: band.tint }}
                      >
                        {String(gapElapsed).padStart(4, "0")}ms
                      </span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="quiet"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-px w-24 bg-border"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Agent */}
              <div className="flex justify-start">
                <motion.p
                  animate={{
                    opacity: stage === "agent" ? 1 : 0.35,
                    y: stage === "agent" ? 0 : 4,
                  }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-[80%] rounded-2xl border px-4 py-2.5 text-[14px] leading-relaxed text-foreground"
                  style={{
                    borderColor: "color-mix(in srgb, var(--features-blue) 32%, transparent)",
                    background: "color-mix(in srgb, var(--features-blue) 12%, transparent)",
                  }}
                >
                  Thursday at 3pm is open — shall I take it?
                </motion.p>
              </div>
            </div>

            </div>

            {/* RIGHT — the control, and the evidence it produces.
                `justify-start`, not `justify-between`: which column is taller
                flips with a single extra line of verdict copy or a bubble that
                wraps, and `justify-between` would then inject gaps between the
                slider and its own tick captions. */}
            <div className="flex flex-col justify-start">
            {/* ---- proportional timeline ---- */}
            <div>
              <div className="relative flex h-7 w-full overflow-hidden rounded-lg border border-border">
                <Segment width={pct(CALLER_S)} label="caller" background="rgba(255,255,255,0.10)" />
                <Segment
                  width={pct(gapS)}
                  label={gapS > 0.55 ? "dead air" : ""}
                  background={`repeating-linear-gradient(45deg, color-mix(in srgb, ${band.tint} 26%, transparent) 0 6px, transparent 6px 12px)`}
                />
                <Segment
                  width={pct(AGENT_S)}
                  label="agent"
                  background="color-mix(in srgb, var(--features-blue) 26%, transparent)"
                />
                <Segment width={pct(REST_S)} label="" background="transparent" />
                {!reduced && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-0 h-full w-[2px]"
                    style={{
                      left: `${(phase / cycle) * 100}%`,
                      background: band.tint,
                      boxShadow: `0 0 10px ${band.tint}`,
                    }}
                  />
                )}
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/50">
                <span>one exchange</span>
                <span className="tabular-nums" style={{ color: band.tint }}>
                  {Math.round((gapS / cycle) * 100)}% of it is silence
                </span>
              </div>
            </div>

            {/* ---- slider ---- */}
            <div className="mt-5">
              {/* h-11, not h-6 — the transparent range input is sized to this
                  box, so it was a 24px-tall drag target on touch. */}
              <div className="relative h-11">
                <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pos / 10}%`,
                      background: `linear-gradient(90deg, color-mix(in srgb, ${band.tint} 45%, transparent), ${band.tint})`,
                    }}
                  />
                </div>
                {/* Reference ticks */}
                {MARKS.map((m) => (
                  <span
                    key={m.ms}
                    aria-hidden
                    className="absolute top-1/2 h-3.5 w-px -translate-y-1/2 bg-white/25"
                    style={{ left: `${msToPct(m.ms)}%` }}
                  />
                ))}
                {/* Visible thumb */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80"
                  style={{
                    left: `${pos / 10}%`,
                    background: band.tint,
                    boxShadow: `0 0 0 4px color-mix(in srgb, ${band.tint} 22%, transparent), 0 0 18px ${band.tint}`,
                  }}
                />
                {/* Real input on top — keyboard, drag and a11y for free */}
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={1}
                  value={pos}
                  onChange={(e) => setPos(Number(e.target.value))}
                  aria-label="Response latency in milliseconds"
                  aria-valuetext={`${ms} milliseconds — ${band.name}`}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>

              {/* Tick labels */}
              <div className="relative mt-1 h-8">
                {MARKS.map((m) => (
                  <span
                    key={m.ms}
                    className="absolute -translate-x-1/2 text-center"
                    style={{ left: `${msToPct(m.ms)}%` }}
                  >
                    <span className="block font-mono text-[10px] tabular-nums text-muted-foreground/70">
                      {m.label}
                    </span>
                    {/* The 200ms caption only survives in the middle band.
                        It and the 300ms mark sit 12.6% apart, so the two
                        captions need ~78px of room but only get 12.6% of the
                        track: fine on a full-width card (115px apart), not fine
                        on a 320px phone (39px) and — since this card went
                        two-column — not fine at lg either, where the track is
                        back down to ~436px and they overlap by ~23px.
                        "Vozpar ceiling" always stays; it's the one annotation
                        the whole section is built around. The 1.2s mark is far
                        enough right to never collide. */}
                    <span
                      className={`whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/45 ${
                        m.ms === 200 ? "hidden sm:block lg:hidden" : "block"
                      }`}
                    >
                      {m.sub}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* ---- verdict ---- */}
            {/* border-t only below lg. In two columns it would be a half-width
                rule terminating in mid-air beside the agent bubble, with
                nothing anchoring its left end. */}
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between lg:mt-5 lg:flex-col lg:items-start lg:border-t-0 lg:pt-0">
              {/* Reserved height. `mode="wait"` unmounts the old copy before
                  the new one mounts, and in a half-width column this paragraph
                  runs four lines — so without a floor the row collapsed to the
                  button's height and the whole card jumped ~53px on every band
                  crossing while dragging the slider. */}
              <div className="lg:min-h-[5.5rem]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={band.name}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-xl text-[15px] font-light leading-relaxed text-muted-foreground"
                >
                  {band.copy}
                </motion.p>
              </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full border border-border px-5 text-xs font-medium text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground sm:self-auto"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Back to 280ms
              </button>
            </div>
            </div>
            </div>
          </div>
        </ScrollReveal>

        <p className="mt-4 text-center text-xs text-muted-foreground/60">
          Vozpar targets sub-300ms round-trip. Stacks that chain speech-to-text, an LLM and text-to-speech typically
          land between 1.2 and 3 seconds.
        </p>
      </div>
    </section>
  )
}

function Segment({ width, label, background }: { width: number; label: string; background: string }) {
  return (
    <div
      className="relative flex h-full items-center justify-center overflow-hidden"
      style={{ width: `${width}%`, background }}
    >
      {label && width > 9 && (
        <span className="truncate px-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/60">{label}</span>
      )}
    </div>
  )
}
