"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { ElementType } from "react"
import { Check, Hourglass, PhoneOff, RotateCcw, Sparkles } from "lucide-react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

/**
 * FeatureIvrRace
 * The same job — "I chipped a tooth, can you fit me in today?" — run down two
 * paths side by side, one step at a time.
 *
 * The honest problem with racing these in realtime is that the IVR path takes
 * four and a half minutes and nobody watches that. So the replay advances one
 * *step* per beat on both sides, and the running clock on each column carries
 * the real durations. The AI column finishes four steps in, then sits there
 * resolved while the legacy column is still reading out its main menu — which
 * is the whole point of the section, made visible rather than asserted.
 */

type Step = { label: string; secs: number }

const IVR: Step[] = [
  { label: "Ringing…", secs: 12 },
  { label: '"For English, press 1."', secs: 14 },
  { label: '"Press 1 for appointments, 2 for billing, 3 for…"', secs: 31 },
  { label: "Wrong branch — press 9 to go back", secs: 26 },
  { label: '"All our agents are currently busy."', secs: 22 },
  { label: "Hold music", secs: 108 },
  { label: '"Can I take your details again?"', secs: 34 },
  { label: "Appointment booked", secs: 18 },
]

const AGENT: Step[] = [
  { label: "Answered on the first ring", secs: 1 },
  { label: '"How can I help?" — caller explains', secs: 7 },
  { label: "Checks live availability, offers two slots", secs: 6 },
  { label: "Books it, texts the confirmation", secs: 8 },
]

/** Running totals, precomputed at module load — deterministic on both runtimes. */
function cumulative(steps: Step[]) {
  let run = 0
  return steps.map((s) => (run += s.secs))
}
const IVR_CUM = cumulative(IVR)
const AGENT_CUM = cumulative(AGENT)
const IVR_TOTAL = IVR_CUM[IVR_CUM.length - 1] // 265s
const AGENT_TOTAL = AGENT_CUM[AGENT_CUM.length - 1] // 22s

/** Wall-clock seconds each step gets on screen. */
const BEAT = 1.05
const RUN = IVR.length * BEAT + 1.2

const loop = Number.POSITIVE_INFINITY

function mmss(total: number) {
  const s = Math.max(0, Math.round(total))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

/** Smoothly interpolated clock for a column at wall time `t`. */
function clockAt(t: number, cum: number[]) {
  const i = Math.floor(t / BEAT)
  if (i >= cum.length) return cum[cum.length - 1]
  const from = i === 0 ? 0 : cum[i - 1]
  const frac = Math.min(1, t / BEAT - i)
  return from + (cum[i] - from) * frac
}

export function FeatureIvrRace() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { margin: "-140px" })

  const [t, setT] = useState(0)
  const [running, setRunning] = useState(false)
  const started = useRef(false)

  const rafRef = useRef<number | null>(null)
  const originRef = useRef(0)

  useEffect(() => {
    if (!running) return
    originRef.current = performance.now()
    const tick = (now: number) => {
      const next = (now - originRef.current) / 1000
      if (next >= RUN) {
        setT(RUN)
        setRunning(false)
        return
      }
      setT(next)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [running])

  // Fires once, the first time the section is properly on screen.
  useEffect(() => {
    if (reduced || started.current || !inView) return
    started.current = true
    setRunning(true)
  }, [inView, reduced])

  const replay = useCallback(() => {
    setT(0)
    setRunning(true)
  }, [])

  const done = reduced || t >= RUN
  const ivrClock = reduced ? IVR_TOTAL : clockAt(t, IVR_CUM)
  const agentClock = reduced ? AGENT_TOTAL : clockAt(t, AGENT_CUM)
  const agentDone = reduced || t >= AGENT.length * BEAT
  const ivrDone = reduced || t >= IVR.length * BEAT

  return (
    <section
      ref={ref}
      className="features-hero-dark relative overflow-hidden border-t border-border"
      style={{ background: "var(--features-hero-bg)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 -z-10 h-[30rem] w-[30rem] translate-x-1/3 rounded-full opacity-50 blur-[140px]"
        style={{ background: "color-mix(in srgb, var(--features-blue-deep) 30%, transparent)" }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <ScrollReveal className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <span className="ai-pill-blue">
            <span className="h-1 w-1 rounded-full bg-current" />
            Same call, two paths
          </span>
          <h2 className="mt-5 text-balance font-heading text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
            What your caller actually sits through.
          </h2>
          <p className="mt-4 text-pretty text-[15px] font-light leading-relaxed text-muted-foreground">
            One request — &ldquo;I chipped a tooth, can you fit me in today?&rdquo; — down a phone menu and down an
            agent. Replayed a step at a time; the clocks are the real durations.
          </p>
        </ScrollReveal>

        {/* Race track — total durations at true proportion. The agent's sliver
            next to the IVR's full bar does more work than any sentence. */}
        <ScrollReveal className="mb-8 md:mb-10">
          <div className="rounded-2xl border border-border bg-card/50 p-5 shadow-lg shadow-black/20 sm:p-6">
            <TrackBar
              label="Legacy IVR"
              value={ivrClock}
              max={IVR_TOTAL}
              tint="var(--features-amber)"
              reduced={reduced}
            />
            <div className="mt-4">
              <TrackBar
                label="Vozpar agent"
                value={agentClock}
                max={IVR_TOTAL}
                tint="var(--features-green)"
                reduced={reduced}
                glow
              />
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
              Bars share one scale — {mmss(IVR_TOTAL)} across
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <Column
            title="Legacy IVR"
            subtitle="Menu tree · hold queue · human handoff"
            icon={Hourglass}
            tint="var(--features-amber)"
            steps={IVR}
            cum={IVR_CUM}
            t={t}
            clock={ivrClock}
            complete={ivrDone}
            reduced={reduced}
            verdict={{ text: "Booked — after 4 minutes 25", tone: "bad" }}
          />
          <Column
            title="Vozpar agent"
            subtitle="Answers, checks, books — one continuous conversation"
            icon={Sparkles}
            tint="var(--features-green)"
            steps={AGENT}
            cum={AGENT_CUM}
            t={t}
            clock={agentClock}
            complete={agentDone}
            reduced={reduced}
            verdict={{ text: "Booked in 22 seconds", tone: "good" }}
            highlight
          />
        </div>

        {/* Payoff */}
        <ScrollReveal className="mt-8 md:mt-10">
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card/50 px-5 py-7 text-center shadow-lg shadow-black/20 sm:px-8">
            <div className="grid w-full max-w-2xl grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <Payoff
                value={done ? `${Math.round(IVR_TOTAL / AGENT_TOTAL)}×` : "—"}
                label="Longer on the legacy path"
                accent="var(--features-amber)"
              />
              <Payoff
                value={done ? mmss(IVR_TOTAL - AGENT_TOTAL) : "—"}
                label="Of the caller's time, saved"
                accent="var(--features-blue)"
              />
              <Payoff
                value={done ? "0" : "—"}
                label="Times they repeat themselves"
                accent="var(--features-green)"
              />
            </div>

            <p className="max-w-xl text-[15px] font-light leading-relaxed text-muted-foreground">
              Most callers don&apos;t wait it out. Every extra minute in the queue is a booking that quietly becomes a
              hang-up.
            </p>

            {!reduced && (
              <button
                type="button"
                onClick={replay}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Replay
              </button>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------- */

function TrackBar({
  label,
  value,
  max,
  tint,
  reduced,
  glow,
}: {
  label: string
  value: number
  max: number
  tint: string
  reduced: boolean | null
  glow?: boolean
}) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">{label}</span>
        <span className="font-heading text-sm font-medium tabular-nums" style={{ color: tint }}>
          {mmss(value)}
        </span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full transition-[width] duration-100 ease-linear"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, color-mix(in srgb, ${tint} 55%, transparent), ${tint})`,
            boxShadow: glow ? `0 0 16px ${tint}` : undefined,
          }}
        />
        {/* Leading edge marker so a 22-second sliver is still legible */}
        {!reduced && pct > 0 && (
          <span
            className="absolute top-0 h-full w-[2px] rounded-full"
            style={{ left: `calc(${pct}% - 1px)`, background: tint, boxShadow: `0 0 10px ${tint}` }}
          />
        )}
      </div>
    </div>
  )
}

function Column({
  title,
  subtitle,
  icon: Icon,
  tint,
  steps,
  cum,
  t,
  clock,
  complete,
  reduced,
  verdict,
  highlight,
}: {
  title: string
  subtitle: string
  icon: ElementType
  tint: string
  steps: Step[]
  cum: number[]
  t: number
  clock: number
  complete: boolean
  reduced: boolean | null
  verdict: { text: string; tone: "good" | "bad" }
  highlight?: boolean
}) {
  const activeIndex = reduced ? steps.length : Math.floor(t / BEAT)

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-2xl border bg-card/60 p-5 shadow-xl shadow-black/25 backdrop-blur-md sm:p-6"
      style={{
        borderColor: highlight ? `color-mix(in srgb, ${tint} 35%, transparent)` : "var(--border)",
        background: highlight
          ? `linear-gradient(165deg, color-mix(in srgb, ${tint} 8%, transparent), transparent 55%)`
          : undefined,
      }}
    >
      {/* Winner's halo. Animated as an overlay's opacity rather than as a
          boxShadow keyframe: the tints are CSS custom properties, and you
          can't append an alpha channel to `var(--x)` by string concatenation. */}
      {highlight && !reduced && complete && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ boxShadow: `inset 0 0 0 1px ${tint}, 0 0 40px color-mix(in srgb, ${tint} 30%, transparent)` }}
          animate={{ opacity: [0.25, 0.7, 0.25] }}
          transition={{ duration: 2.6, repeat: loop, ease: "easeInOut" }}
        />
      )}

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0" style={{ color: tint }} aria-hidden />
            <span className="font-heading text-base font-medium tracking-[-0.02em] text-foreground sm:text-lg">
              {title}
            </span>
          </span>
          <p className="mt-1.5 text-xs font-light leading-relaxed text-muted-foreground">{subtitle}</p>
        </div>
        <span
          className="shrink-0 rounded-lg px-2.5 py-1 font-heading text-base font-medium tabular-nums sm:text-lg"
          style={{ color: tint, background: `color-mix(in srgb, ${tint} 12%, transparent)` }}
        >
          {mmss(clock)}
        </span>
      </div>

      <ol className="relative mt-5 space-y-2.5">
        {steps.map((step, i) => {
          const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "pending"
          return (
            <motion.li
              key={step.label}
              animate={{ opacity: state === "pending" ? 0.3 : 1 }}
              transition={{ duration: 0.35 }}
              className="relative flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors duration-300"
              style={{
                borderColor:
                  state === "pending" ? "var(--border)" : `color-mix(in srgb, ${tint} 30%, transparent)`,
                background:
                  state === "active"
                    ? `color-mix(in srgb, ${tint} 12%, transparent)`
                    : state === "done"
                      ? `color-mix(in srgb, ${tint} 5%, transparent)`
                      : "transparent",
              }}
            >
              {/* Beat fill on the active row — the visible tick of the clock */}
              {state === "active" && !reduced && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 rounded-xl"
                  style={{ background: `color-mix(in srgb, ${tint} 10%, transparent)` }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: BEAT, ease: "linear" }}
                />
              )}
              <span
                className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px] font-medium tabular-nums"
                style={{
                  borderColor: state === "pending" ? "var(--border)" : `color-mix(in srgb, ${tint} 45%, transparent)`,
                  background: state === "done" ? tint : "transparent",
                  color: state === "done" ? "#0B1220" : tint,
                }}
              >
                {state === "done" ? <Check className="h-3 w-3" aria-hidden /> : i + 1}
              </span>
              <span className="relative min-w-0 flex-1 text-[13px] leading-snug text-muted-foreground">
                {step.label}
              </span>
              <span className="relative shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/60">
                +{step.secs}s
              </span>
            </motion.li>
          )
        })}
      </ol>

      {/* Verdict — lands the moment the column finishes */}
      <motion.div
        initial={false}
        animate={{ opacity: complete ? 1 : 0, y: complete ? 0 : 8 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-5 flex items-center gap-2.5 rounded-xl border px-3.5 py-3"
        style={{
          borderColor: `color-mix(in srgb, ${tint} 35%, transparent)`,
          background: `color-mix(in srgb, ${tint} 10%, transparent)`,
        }}
      >
        {verdict.tone === "good" ? (
          <Check className="h-4 w-4 shrink-0" style={{ color: tint }} aria-hidden />
        ) : (
          <PhoneOff className="h-4 w-4 shrink-0" style={{ color: tint }} aria-hidden />
        )}
        <span className="text-sm font-medium text-foreground">{verdict.text}</span>
      </motion.div>

      {/* Total cumulative seconds, for anyone checking the arithmetic */}
      <p className="relative mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/50">
        {steps.length} steps · {mmss(cum[cum.length - 1])} total
      </p>
    </div>
  )
}

function Payoff({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <div className="px-4 py-3">
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="font-heading text-2xl font-medium tabular-nums tracking-[-0.025em] sm:text-3xl"
        style={{ color: accent }}
      >
        {value}
      </motion.p>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{label}</p>
    </div>
  )
}
