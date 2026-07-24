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
      {/* Ambient glow removed — flat black canvas per the /features theme. */}

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-16">
        <ScrollReveal className="mx-auto mb-6 max-w-2xl text-center md:mb-8">
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
        <ScrollReveal className="mb-5 md:mb-6">
          <div className="rounded-2xl border border-border bg-card/30 p-4 shadow-lg shadow-black/20 sm:p-5">
            <TrackBar
              label="Legacy IVR"
              value={ivrClock}
              max={IVR_TOTAL}
              tint="var(--features-amber)"
              reduced={reduced}
            />
            <div className="mt-3">
              <TrackBar
                label="Vozpar agent"
                value={agentClock}
                max={IVR_TOTAL}
                tint="var(--features-green)"
                reduced={reduced}
                glow
              />
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
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
        <ScrollReveal className="mt-5 md:mt-6">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card/30 px-5 py-5 text-center shadow-lg shadow-black/20 sm:px-8">
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
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 text-xs font-medium text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground"
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
  const listRef = useRef<HTMLOListElement | null>(null)

  // Follows the active row down the list as the replay advances — like a
  // chat log auto-scrolling as new lines land, not a "keep it centered"
  // camera. Only ever scrolls forward (never back up), and only once the
  // active row would actually run past the bottom edge of the capped box —
  // so the first few steps sit still (they already fit) and the list starts
  // visibly moving once there's more content than room. Scrolls the list's
  // own scrollTop directly (not scrollIntoView) so it never reaches out to
  // the page's scroll position — only this box moves.
  useEffect(() => {
    const container = listRef.current
    const activeEl = container?.children[activeIndex] as HTMLElement | undefined
    if (!container || !activeEl) return
    const bottomEdge = activeEl.offsetTop + activeEl.offsetHeight - container.clientHeight
    if (bottomEdge > container.scrollTop) {
      container.scrollTo({ top: bottomEdge, behavior: reduced ? "auto" : "smooth" })
    }
  }, [activeIndex, reduced])

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-2xl border bg-card/30 p-4 shadow-xl shadow-black/25 backdrop-blur-md sm:p-5"
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

      {/* Steps show at every width. They were desktop-only for a while to keep
          the mobile section short, but the lists are the actual content — the
          words a caller sits through — so hiding them left the phone version
          saying "8 steps" without showing any. Tighter spacing on mobile keeps
          the height in check instead.
          Capped height + internal scroll (rather than letting 8 rows push the
          card past the fold): every step stays in the DOM and readable, it
          just scrolls in its own box instead of stretching the section. */}
      <ol
        ref={listRef}
        className="relative mt-4 max-h-[240px] space-y-1.5 overflow-y-auto pr-1 [scrollbar-width:none] sm:space-y-2 md:max-h-[280px] [&::-webkit-scrollbar]:hidden"
      >
        {steps.map((step, i) => {
          const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "pending"
          // Reached = the conversation has arrived at this line. The row's box
          // is always present (reserving its height, so nothing reflows), but
          // its content only drops in once reached — an empty slot waiting,
          // then filling, like a live transcript populating.
          const reached = reduced || i <= activeIndex
          return (
            <li
              key={step.label}
              className="relative flex items-center gap-3 overflow-hidden rounded-xl border px-3 py-2 transition-colors duration-500"
              style={{
                borderColor:
                  state === "pending"
                    ? "color-mix(in srgb, var(--border) 60%, transparent)"
                    : `color-mix(in srgb, ${tint} 30%, transparent)`,
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

              {/* Number / check. Pending is a faint hollow dot; the moment the
                  row is reached it springs to the numbered state, and a
                  completed step flips to a filled check. */}
              <motion.span
                className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px] font-medium tabular-nums"
                initial={false}
                animate={{ scale: state === "active" ? [1, 1.18, 1] : 1 }}
                transition={{ duration: BEAT, repeat: state === "active" ? loop : 0, ease: "easeInOut" }}
                style={{
                  borderColor: reached ? `color-mix(in srgb, ${tint} 45%, transparent)` : "var(--border)",
                  background: state === "done" ? tint : "transparent",
                  color: state === "done" ? "var(--background)" : tint,
                }}
              >
                {state === "done" ? <Check className="h-3 w-3" aria-hidden /> : reached ? i + 1 : ""}
              </motion.span>

              {/* Content drops in on reveal. `y` from −10 with a spring gives
                  the "dropped into place" feel; pending rows hold an empty
                  slot at low opacity so the list reads as upcoming turns. */}
              <motion.span
                className="relative min-w-0 flex-1 text-[13px] leading-snug text-muted-foreground"
                initial={false}
                animate={{ opacity: reached ? 1 : 0.12, y: reached ? 0 : -10, filter: reached ? "blur(0px)" : "blur(2px)" }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
              >
                {step.label}
              </motion.span>

              <motion.span
                className="relative shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/60"
                initial={false}
                animate={{ opacity: reached ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                +{step.secs}s
              </motion.span>
            </li>
          )
        })}
      </ol>

      {/* Verdict — lands the moment the column finishes */}
      <motion.div
        initial={false}
        animate={{ opacity: complete ? 1 : 0, y: complete ? 0 : 8 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-4 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5"
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
      <p className="relative mt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/50">
        {steps.length} steps · {mmss(cum[cum.length - 1])} total
      </p>

      {/* Standing-by filler. Only the winning column, only once it's done — it
          fills the space the shorter column leaves against the taller one, and
          fills it with the actual point of the section: the agent has finished
          and is sitting idle while the IVR is still grinding. */}
      {highlight && <StandingBy tint={tint} active={complete} reduced={reduced} />}
    </div>
  )
}

/**
 * Idle "line free" state that fills the winner column's slack space.
 *
 * A radar at rest: a resolved core, sonar rings pushing out from it, and a
 * conic sweep rotating behind — the agent has finished and is listening, while
 * the IVR column beside it is still grinding through its menu tree.
 */
function StandingBy({ tint, active, reduced }: { tint: string; active: boolean; reduced: boolean | null }) {
  return (
    <motion.div
      aria-hidden
      className="relative mt-3 flex min-h-[84px] flex-1 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border"
      style={{
        borderColor: `color-mix(in srgb, ${tint} 22%, transparent)`,
        background: `radial-gradient(130% 110% at 50% 100%, color-mix(in srgb, ${tint} 10%, transparent), transparent 72%)`,
      }}
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Faint concentric range rings, static — the radar's grid */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, transparent 30%, color-mix(in srgb, ${tint} 8%, transparent) 31%, transparent 33%, transparent 55%, color-mix(in srgb, ${tint} 6%, transparent) 56%, transparent 58%)`,
        }}
      />

      <div className="relative flex h-14 w-14 items-center justify-center">
        {/* Rotating conic sweep — the radar hand */}
        {!reduced && active && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb, ${tint} 34%, transparent) 40deg, transparent 90deg)`,
              maskImage: "radial-gradient(circle, #000 62%, transparent 63%)",
              WebkitMaskImage: "radial-gradient(circle, #000 62%, transparent 63%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3.4, repeat: loop, ease: "linear" }}
          />
        )}

        {/* Orbiting blip — a contact circling the resolved core */}
        {!reduced && active && (
          <motion.span
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 4.2, repeat: loop, ease: "linear" }}
          >
            <span
              className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
              style={{ background: tint, boxShadow: `0 0 8px ${tint}` }}
            />
          </motion.span>
        )}

        {/* Resolved core */}
        <motion.span
          className="relative flex h-9 w-9 items-center justify-center rounded-full border"
          style={{
            background: `color-mix(in srgb, ${tint} 20%, transparent)`,
            borderColor: `color-mix(in srgb, ${tint} 50%, transparent)`,
            color: tint,
          }}
          animate={reduced || !active ? undefined : { boxShadow: [`0 0 0px ${tint}`, `0 0 14px color-mix(in srgb, ${tint} 55%, transparent)`, `0 0 0px ${tint}`] }}
          transition={{ duration: 2.6, repeat: loop, ease: "easeInOut" }}
        >
          <Check className="h-4 w-4" aria-hidden />
        </motion.span>
      </div>

      {/* Listening waveform — replaces the old expanding sonar rings. Rings
          read as "searching"; bars read as "hearing", which is closer to what
          standing-by actually means here, and it echoes the same audio-bar
          motif the call-demo waveform above already uses instead of a second
          circular idiom on the same page. */}
      {!reduced && active && (
        <div className="flex h-4 items-center justify-center gap-[3px]" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="w-[2.5px] rounded-full"
              style={{ background: tint, boxShadow: `0 0 6px color-mix(in srgb, ${tint} 60%, transparent)` }}
              initial={{ height: 4 }}
              animate={{ height: [4, 15, 6, 13, 4] }}
              transition={{ duration: 1.4, repeat: loop, delay: i * 0.11, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}

      {/* Brand nameplate — the radar has resolved to Vozpar, said plainly
          instead of just implied by the column header above it. Set as
          animated type, not the static logo mark: each letter blurs up into
          place a beat after the core settles (the radar "identifying" the
          contact), then the whole word breathes with a slow glow and a
          shine sweeps across it once — so it stays visibly alive rather than
          just appearing once and sitting still. */}
      <div className="relative overflow-hidden">
        <motion.p
          className="relative flex font-heading text-[13px] font-medium uppercase tracking-[0.28em]"
          style={{ color: tint }}
          animate={{ opacity: active ? [1, 0.78, 1] : 0 }}
          transition={
            active
              ? { opacity: { duration: 2.4, repeat: loop, ease: "easeInOut", delay: 0.9 } }
              : { duration: 0.3 }
          }
        >
          {"VOZPAR".split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={false}
              animate={
                active
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 6, filter: "blur(3px)" }
              }
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
                delay: active && !reduced ? 0.3 + i * 0.05 : 0,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.p>
        {/* One shine pass across the settled word, timed to land just after
            the last letter locks in. */}
        {!reduced && active && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
            style={{
              background: `linear-gradient(100deg, transparent, color-mix(in srgb, ${tint} 85%, white), transparent)`,
              mixBlendMode: "overlay",
            }}
            initial={{ x: "-140%" }}
            animate={{ x: "340%" }}
            transition={{ duration: 0.9, delay: 0.9, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </div>

      <span className="relative inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
        <motion.span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: tint, boxShadow: `0 0 8px ${tint}` }}
          animate={reduced || !active ? undefined : { opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: loop, ease: "easeInOut" }}
        />
        Line free · standing by
      </span>
    </motion.div>
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
