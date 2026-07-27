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

type Band = { name: string; tint: string; glow: string; copy: string }

function bandFor(ms: number): Band {
  if (ms <= 200) {
    return {
      name: "Ultra fast",
      tint: "#3b82f6", // 120-200ms: Blue
      glow: "rgba(59, 130, 246, 0.4)",
      copy: "Sub-200ms ultra fast response (120–200ms). Imperceptible latency — response arrives before the caller even registers a beat.",
    }
  }
  if (ms <= 300) {
    return {
      name: "Feels human",
      tint: "#10b981", // 200-300ms: Green
      glow: "rgba(16, 185, 129, 0.4)",
      copy: "Inside the range of a natural conversational pause (200–300ms). Callers don't register a gap at all — they just talk.",
    }
  }
  if (ms <= 1200) {
    return {
      name: "Noticeable lag",
      tint: "#ff7a00", // 300-1200ms: Orange
      glow: "rgba(255, 122, 0, 0.4)",
      copy: "Noticeable hesitation (300–1200ms). A beat of dead air before every reply — long enough that rhythm is subtly off.",
    }
  }
  return {
    name: "Falls apart",
    tint: "#ef4444", // 1200-3000ms: Red
    glow: "rgba(239, 68, 68, 0.4)",
    copy: "Severe delay (1200–3000ms). Callers assume the line dropped, repeat themselves, interrupt, or hang up.",
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
            className="relative overflow-hidden rounded-2xl border bg-card/30 p-5 shadow-2xl backdrop-blur-md transition-all duration-500 sm:p-6 md:p-7"
            style={{
              borderColor: `color-mix(in srgb, ${band.tint} 45%, transparent)`,
              boxShadow: `0 0 35px -5px color-mix(in srgb, ${band.tint} 22%, transparent), 0 20px 25px -5px rgba(0,0,0,0.5)`,
              background: `radial-gradient(circle at 70% 30%, color-mix(in srgb, ${band.tint} 12%, transparent) 0%, transparent 70%), var(--card)`,
            }}
          >
            <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col">
            {/* ---- readout ---- */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                  Response latency
                </p>
                <p
                  className="mt-1 font-heading text-4xl font-medium tabular-nums leading-none tracking-[-0.035em] transition-all duration-500 sm:text-5xl md:text-6xl"
                  style={{
                    color: band.tint,
                    textShadow: `0 0 25px color-mix(in srgb, ${band.tint} 40%, transparent)`,
                  }}
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
                className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-500"
                style={{
                  color: band.tint,
                  borderColor: `color-mix(in srgb, ${band.tint} 50%, transparent)`,
                  background: `color-mix(in srgb, ${band.tint} 16%, transparent)`,
                  boxShadow: `0 0 14px color-mix(in srgb, ${band.tint} 30%, transparent)`,
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

              {/* Dead air */}
              <div className="flex h-10 items-center justify-center">
                <AnimatePresence mode="wait">
                  {stage === "gap" ? (
                    <motion.span
                      key="gap"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.18 }}
                      className="inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 transition-all duration-500"
                      style={{
                        borderColor: `color-mix(in srgb, ${band.tint} 50%, transparent)`,
                        background: `color-mix(in srgb, ${band.tint} 14%, transparent)`,
                        boxShadow: `0 0 12px color-mix(in srgb, ${band.tint} 25%, transparent)`,
                      }}
                    >
                      <motion.span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          background: band.tint,
                          boxShadow: `0 0 8px ${band.tint}`,
                        }}
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
                  className="max-w-[80%] rounded-2xl border px-4 py-2.5 text-[14px] leading-relaxed text-foreground transition-all duration-500"
                  style={{
                    borderColor: `color-mix(in srgb, ${band.tint} 35%, transparent)`,
                    background: `color-mix(in srgb, ${band.tint} 14%, transparent)`,
                  }}
                >
                  Thursday at 3pm is open — shall I take it?
                </motion.p>
              </div>
            </div>

            </div>

            {/* RIGHT */}
            <div className="flex flex-col justify-start">
            {/* ---- proportional timeline ---- */}
            <div>
              <div className="relative flex h-7 w-full overflow-hidden rounded-lg border border-border">
                <Segment width={pct(CALLER_S)} label="caller" background="rgba(255,255,255,0.10)" />
                <Segment
                  width={pct(gapS)}
                  label={gapS > 0.55 ? "dead air" : ""}
                  background={`repeating-linear-gradient(45deg, color-mix(in srgb, ${band.tint} 35%, transparent) 0 6px, transparent 6px 12px)`}
                />
                <Segment
                  width={pct(AGENT_S)}
                  label="agent"
                  background={`color-mix(in srgb, ${band.tint} 26%, transparent)`}
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
                <span className="tabular-nums transition-colors duration-500" style={{ color: band.tint }}>
                  {Math.round((gapS / cycle) * 100)}% of it is silence
                </span>
              </div>
            </div>

            {/* ---- slider ---- */}
            <div className="mt-5">
              <div className="relative h-11">
                <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${pos / 10}%`,
                      background: `linear-gradient(90deg, color-mix(in srgb, ${band.tint} 50%, transparent), ${band.tint})`,
                      boxShadow: `0 0 12px color-mix(in srgb, ${band.tint} 40%, transparent)`,
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
                  className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80 transition-all duration-300"
                  style={{
                    left: `${pos / 10}%`,
                    background: band.tint,
                    boxShadow: `0 0 0 4px color-mix(in srgb, ${band.tint} 30%, transparent), 0 0 20px ${band.tint}`,
                  }}
                />
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
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between lg:mt-5 lg:flex-col lg:items-start lg:border-t-0 lg:pt-0">
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
                className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full border px-5 text-xs font-medium transition-all duration-300 hover:scale-105 sm:self-auto"
                style={{
                  borderColor: `color-mix(in srgb, ${band.tint} 45%, transparent)`,
                  color: band.tint,
                  background: `color-mix(in srgb, ${band.tint} 10%, transparent)`,
                }}
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
