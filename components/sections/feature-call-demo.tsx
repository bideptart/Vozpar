"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Check, Loader2, Pause, PhoneCall, Play, RotateCcw, Zap } from "lucide-react"
import { AnimatePresence, motion, useInView, useReducedMotion } from "@/lib/motion"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

/**
 * FeatureCallDemo
 * A replayable, time-driven reconstruction of one real call.
 *
 * The rest of the page *describes* the capabilities; this section plays them.
 * A single clock (seconds since call start) drives everything — which lines
 * have landed, who currently holds the floor, which tool calls have fired,
 * what the latency readout says. That means scrubbing backwards is free: no
 * state to unwind, just a smaller `time`.
 *
 * Everything in SCRIPT is a hard-coded literal (no Math.random, no Date) so
 * the server render and the first client render agree.
 */

// Written out as a flat discriminated union rather than
// `{ t, speak } & (…|…)`. TypeScript's narrowing on `entry.kind` is far more
// reliable when the discriminant sits directly on each member, and
// `Extract<Entry, { kind: "tool" }>` below only behaves with the flat form.
type Entry =
  | { t: number; speak: number; kind: "caller"; text: string; bargeIn?: boolean }
  | { t: number; speak: number; kind: "agent"; text: string; ms: number }
  | { t: number; speak?: number; kind: "tool"; name: string; result: string; ms: number }
  | { t: number; speak?: number; kind: "event"; text: string }

/** Inbound call to a dental practice — the archetypal "book me in" job. */
const SCRIPT: Entry[] = [
  { t: 0.0, kind: "event", text: "Inbound call · +1 (415) 555-0142" },
  {
    t: 0.4,
    speak: 3.0,
    kind: "agent",
    ms: 268,
    text: "Thanks for calling Northside Dental — this is Ava. How can I help?",
  },
  {
    t: 3.6,
    speak: 3.2,
    kind: "caller",
    text: "Hi — I chipped a tooth this morning. Any chance you can fit me in today?",
  },
  {
    t: 6.9,
    speak: 2.5,
    kind: "agent",
    ms: 241,
    text: "Sorry to hear that — checking today's openings now.",
  },
  { t: 8.2, kind: "tool", name: "calendar.findSlots", result: "3 open today", ms: 180 },
  { t: 9.6, speak: 2.0, kind: "agent", ms: 265, text: "I have 2:15 or 4:40 with Dr. Patel." },
  { t: 11.4, speak: 1.8, kind: "caller", bargeIn: true, text: "Two fift— actually, make it the later one." },
  { t: 13.3, speak: 0.8, kind: "agent", ms: 212, text: "4:40 it is." },
  { t: 14.0, kind: "tool", name: "crm.upsertPatient", result: "record updated", ms: 142 },
  { t: 14.8, kind: "tool", name: "calendar.book", result: "slot confirmed", ms: 198 },
  {
    t: 15.6,
    speak: 3.2,
    kind: "agent",
    ms: 255,
    text: "Booked for 4:40 today — the confirmation just went to your phone.",
  },
  { t: 19.0, speak: 1.0, kind: "caller", text: "Perfect, thanks." },
  { t: 20.4, kind: "event", text: "Call ended · summary + transcript synced to CRM" },
]

const TOTAL = 22

/** Bar peaks for the waveform. Fixed literals, not generated — see file note. */
const BARS = [
  0.35, 0.72, 0.48, 0.95, 0.6, 0.82, 0.4, 1, 0.55, 0.68, 0.9, 0.44, 0.76, 0.58, 0.98, 0.42, 0.85, 0.63, 0.5, 0.88,
  0.7, 0.38, 0.92, 0.56, 0.8, 0.46, 0.66, 0.34,
]

const loop = Number.POSITIVE_INFINITY

export function FeatureCallDemo() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const inView = useInView(sectionRef, { margin: "-120px" })

  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [touched, setTouched] = useState(false) // user pressed something → stop auto-driving

  /* ---- clock ---------------------------------------------------------- */
  // A rAF loop rather than setInterval: the scrubber and the waveform read
  // the same value, so a jittery 50ms tick would show up as a stuttering bar.
  const rafRef = useRef<number | null>(null)
  const originRef = useRef(0) // performance.now() that corresponds to time = 0
  // Mirrors `time` for the effects that need to read it without re-subscribing
  // every frame (the rAF loop and the autoplay watcher both would).
  const timeRef = useRef(0)
  timeRef.current = time

  useEffect(() => {
    if (!playing) return
    originRef.current = performance.now() - timeRef.current * 1000

    const tick = (now: number) => {
      const next = (now - originRef.current) / 1000
      if (next >= TOTAL) {
        setTime(TOTAL)
        setPlaying(false)
        return
      }
      setTime(next)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [playing])

  /* ---- autoplay on scroll-in, pause on scroll-out --------------------- */
  // Keyed on `inView` alone. Reading the clock from a ref keeps this from
  // re-running 60 times a second while the call plays.
  useEffect(() => {
    if (reduced || touched) return
    setPlaying(inView && timeRef.current < TOTAL)
  }, [inView, reduced, touched])

  const restart = useCallback(() => {
    setTouched(true)
    setTime(0)
    setPlaying(true)
  }, [])

  const toggle = useCallback(() => {
    setTouched(true)
    // Restarting a finished call is a separate decision from play/pause, so it
    // happens here rather than inside the state updater — updaters must stay
    // pure or StrictMode's double-invoke fires the reset twice.
    const atEnd = timeRef.current >= TOTAL
    if (atEnd) setTime(0)
    setPlaying((p) => (atEnd ? true : !p))
  }, [])

  const seek = useCallback((fraction: number) => {
    setTouched(true)
    setTime(Math.min(TOTAL, Math.max(0, fraction * TOTAL)))
  }, [])

  /* ---- derived state — all pure functions of `time` ------------------- */
  // Reduced motion gets the finished call: the whole transcript, no clock.
  const shown = reduced ? SCRIPT : SCRIPT.filter((e) => e.t <= time)

  const speaker = useMemo(() => {
    if (reduced) return null
    for (let i = SCRIPT.length - 1; i >= 0; i--) {
      const e = SCRIPT[i]
      const speak = e.speak ?? 0
      if (speak > 0 && e.t <= time && time < e.t + speak) {
        if (e.kind === "caller" || e.kind === "agent") return e.kind
      }
    }
    return null
  }, [time, reduced])

  const latency = useMemo(() => {
    let last = 268
    for (const e of SCRIPT) {
      if (e.t > time) break
      if (e.kind === "agent") last = e.ms
    }
    return last
  }, [time])

  const tools = SCRIPT.filter((e): e is Extract<Entry, { kind: "tool" }> => e.kind === "tool")
  const progress = Math.min(1, time / TOTAL)
  const ended = time >= TOTAL

  /* ---- transcript auto-scroll ----------------------------------------- */
  const streamRef = useRef<HTMLDivElement | null>(null)
  const countRef = useRef(0)
  useEffect(() => {
    if (reduced) return
    if (shown.length === countRef.current) return
    countRef.current = shown.length
    const el = streamRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [shown.length, reduced])

  const speakerAccent =
    speaker === "agent" ? "var(--features-blue)" : speaker === "caller" ? "var(--muted-foreground)" : "var(--border)"

  return (
    <section
      ref={sectionRef}
      className="features-hero-dark relative overflow-hidden border-t border-border"
      style={{ background: "var(--features-hero-bg)" }}
    >
      {/* Ambient glow removed — flat black canvas per the /features theme. */}

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-16">
        <ScrollReveal className="mx-auto mb-6 max-w-2xl text-center md:mb-8">
          <span className="ai-pill-blue">
            <span className="h-1 w-1 rounded-full bg-current" />
            Watch a real call
          </span>
          <h2 className="mt-5 text-balance font-heading text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
            Twenty seconds, start to booked.
          </h2>
          <p className="mt-4 text-pretty text-[15px] font-light leading-relaxed text-muted-foreground">
            An inbound call, replayed at real speed — every reply, every interruption, and every API call the agent
            makes while the caller is still on the line.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
            {/* ---------- CONSOLE ---------- */}
            <div className="lg:col-span-5">
              <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card/30 p-5 shadow-xl shadow-black/30 backdrop-blur-md sm:p-6">
                {/* Live edge — a light sweeping the panel's top border while the
                    call is running. Reads as "this thing is on". */}
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, var(--features-blue), transparent)`,
                  }}
                  animate={reduced || !playing ? { opacity: 0.3 } : { x: ["-60%", "160%"] }}
                  transition={{ duration: 2.6, repeat: loop, ease: "easeInOut" }}
                />

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                    <PhoneCall className="h-3.5 w-3.5" style={{ color: "var(--features-blue)" }} />
                    Call console
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em]">
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: ended ? "var(--muted-foreground)" : "var(--features-green)" }}
                      animate={reduced || ended || !playing ? undefined : { opacity: [1, 0.25, 1] }}
                      transition={{ duration: 1.4, repeat: loop, ease: "easeInOut" }}
                    />
                    <span className={ended ? "text-muted-foreground/60" : "text-foreground"}>
                      {ended ? "ended" : "live"}
                    </span>
                  </span>
                </div>

                {/* Waveform — colour tells you who holds the floor */}
                <div className="mt-4 flex h-16 items-center justify-center gap-[3px] sm:gap-1">
                  {BARS.map((peak, i) => (
                    <motion.span
                      key={i}
                      className="w-[3px] rounded-full sm:w-1"
                      style={{
                        height: "60%",
                        transformOrigin: "center",
                        background:
                          speaker === "agent"
                            ? "linear-gradient(to top, var(--features-blue-deep), var(--features-blue))"
                            : speaker === "caller"
                              ? "var(--muted-foreground)"
                              : "rgba(255,255,255,0.12)",
                      }}
                      animate={
                        reduced || !speaker
                          ? { scaleY: 0.14 }
                          : { scaleY: [0.16, peak, 0.24, peak * 0.7, 0.16] }
                      }
                      transition={
                        speaker && !reduced
                          ? { duration: 1 + (i % 5) * 0.08, repeat: loop, ease: "easeInOut", delay: (i % 7) * 0.04 }
                          : { duration: 0.35, ease: "easeOut" }
                      }
                    />
                  ))}
                </div>

                <p className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                  {speaker === "agent" ? "Agent speaking" : speaker === "caller" ? "Caller speaking" : "Listening"}
                </p>

                {/* Telemetry */}
                <div className="mt-4 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-xl border border-border">
                  <Readout label="Elapsed" value={`${Math.min(time, TOTAL).toFixed(1)}s`} />
                  <Readout
                    label="Last reply"
                    value={`${latency}ms`}
                    accent="var(--features-blue)"
                    pulseKey={latency}
                    reduced={reduced}
                  />
                  <Readout label="Handoffs" value="0" />
                </div>

                {/* Action rail — tool calls landing as they fire */}
                <div className="mt-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                    Actions taken mid-call
                  </p>
                  <ul className="mt-3 space-y-2">
                    {tools.map((tool) => {
                      const fired = reduced || time >= tool.t
                      const done = reduced || time >= tool.t + tool.ms / 1000
                      return (
                        <li
                          key={tool.name}
                          className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-colors duration-300"
                          style={{
                            borderColor: fired
                              ? "color-mix(in srgb, var(--features-green) 32%, transparent)"
                              : "var(--border)",
                            background: fired
                              ? "color-mix(in srgb, var(--features-green) 8%, transparent)"
                              : "transparent",
                            opacity: fired ? 1 : 0.4,
                          }}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            {done ? (
                              <Check
                                className="h-3.5 w-3.5 shrink-0"
                                style={{ color: "var(--features-green)" }}
                                aria-hidden
                              />
                            ) : fired ? (
                              <Loader2
                                className="h-3.5 w-3.5 shrink-0 animate-spin"
                                style={{ color: "var(--features-green)" }}
                                aria-hidden
                              />
                            ) : (
                              <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-border" />
                            )}
                            <span className="truncate font-mono text-[11px] text-foreground">{tool.name}</span>
                          </span>
                          <span className="shrink-0 font-mono text-[10px] text-muted-foreground/70">
                            {done ? tool.result : fired ? "running" : `${tool.ms}ms`}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* ---------- TRANSCRIPT ---------- */}
            <div className="lg:col-span-7">
              <div
                className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card/30 shadow-xl shadow-black/30 backdrop-blur-md transition-colors duration-500"
                style={{ borderColor: speaker ? `color-mix(in srgb, ${speakerAccent} 45%, transparent)` : "var(--border)" }}
              >
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                    Live transcript
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]"
                    style={{
                      color: "var(--features-blue)",
                      background: "color-mix(in srgb, var(--features-blue) 12%, transparent)",
                    }}
                  >
                    <Zap className="h-3 w-3" aria-hidden />
                    streaming
                  </span>
                </div>

                {/* Fixed height so the page doesn't jump as lines land */}
                <div
                  ref={streamRef}
                  // Scrollbar hidden: the transcript auto-scrolls as lines
                  // land, so the bar is never something you're meant to drag —
                  // it just sat there as a grey strip down the side of what is
                  // supposed to read as a phone call. Scrolling still works
                  // (wheel, trackpad, keyboard); only the chrome is gone.
                  className="min-h-[260px] flex-1 space-y-3 overflow-y-auto px-4 py-5 [scrollbar-width:none] sm:px-6 md:min-h-[300px] md:max-h-[340px] [&::-webkit-scrollbar]:hidden"
                >
                  <AnimatePresence initial={false}>
                    {shown.map((e) => (
                      <motion.div
                        key={`${e.t}-${e.kind}`}
                        initial={reduced ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <TranscriptRow entry={e} />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing indicator while the agent composes its reply */}
                  {!reduced && !ended && !speaker && (
                    <div className="flex items-center gap-1.5 pl-1 pt-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: "var(--features-blue)" }}
                          animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                          transition={{ duration: 1.1, repeat: loop, delay: i * 0.16, ease: "easeInOut" }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* ---------- TRANSPORT ---------- */}
                <div className="flex items-center gap-3 border-t border-border px-4 py-3 sm:px-5">
                  <button
                    type="button"
                    onClick={toggle}
                    aria-label={playing ? "Pause the call replay" : "Play the call replay"}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, var(--features-blue), var(--features-blue-deep))" }}
                  >
                    {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={restart}
                    aria-label="Restart the call replay"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-white/30 hover:text-foreground"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>

                  <Scrubber progress={progress} onSeek={seek} />

                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground/70">
                    {Math.min(time, TOTAL).toFixed(1)} / {TOTAL.toFixed(1)}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------- */

function Readout({
  label,
  value,
  accent,
  pulseKey,
  reduced,
}: {
  label: string
  value: string
  accent?: string
  pulseKey?: number
  reduced?: boolean | null
}) {
  return (
    <div className="px-3 py-3 text-center">
      <motion.p
        key={pulseKey}
        initial={reduced || pulseKey === undefined ? false : { scale: 1.16, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="font-heading text-base font-medium tabular-nums tracking-[-0.02em] sm:text-lg"
        style={{ color: accent ?? "var(--foreground)" }}
      >
        {value}
      </motion.p>
      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">{label}</p>
    </div>
  )
}

function Scrubber({ progress, onSeek }: { progress: number; onSeek: (f: number) => void }) {
  return (
    // Vertical padding is the touch target. Without it this is a flex item in
    // an `items-center` row, so its height collapses to the 4px track — and
    // the transparent range input, sized `inset-0`, collapses with it. 4px is
    // not something you can hit with a thumb.
    <div className="relative flex flex-1 items-center py-5">
      {/* The visible track */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, var(--features-blue-deep), var(--features-blue))",
          }}
        />
      </div>
      {/* A real range input on top, transparent — gets keyboard support,
          screen-reader semantics and drag handling for free. */}
      <input
        type="range"
        min={0}
        max={1000}
        value={Math.round(progress * 1000)}
        onChange={(ev) => onSeek(Number(ev.target.value) / 1000)}
        aria-label="Scrub the call replay"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  )
}

function TranscriptRow({ entry }: { entry: Entry }) {
  if (entry.kind === "event") {
    return (
      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
          {entry.text}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
    )
  }

  if (entry.kind === "tool") {
    return (
      <div className="flex justify-center">
        <span
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-[11px]"
          style={{
            borderColor: "color-mix(in srgb, var(--features-green) 32%, transparent)",
            background: "color-mix(in srgb, var(--features-green) 8%, transparent)",
            color: "var(--features-green)",
          }}
        >
          <Check className="h-3 w-3" aria-hidden />
          {entry.name}
          <span className="text-muted-foreground/60">→ {entry.result}</span>
          <span className="text-muted-foreground/50">{entry.ms}ms</span>
        </span>
      </div>
    )
  }

  const isAgent = entry.kind === "agent"
  return (
    <div className={`flex ${isAgent ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[85%] ${isAgent ? "" : "text-right"}`}>
        <div className="mb-1 flex items-center gap-2" style={{ justifyContent: isAgent ? "flex-start" : "flex-end" }}>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/60">
            {isAgent ? "Agent" : "Caller"}
          </span>
          {isAgent && (
            <span
              className="rounded-full px-1.5 py-px font-mono text-[9px]"
              style={{
                color: "var(--features-blue)",
                background: "color-mix(in srgb, var(--features-blue) 14%, transparent)",
              }}
            >
              {entry.ms}ms
            </span>
          )}
          {!isAgent && entry.bargeIn && (
            <span
              className="rounded-full px-1.5 py-px font-mono text-[9px]"
              style={{
                color: "var(--features-amber)",
                background: "color-mix(in srgb, var(--features-amber) 16%, transparent)",
              }}
            >
              barge-in
            </span>
          )}
        </div>
        <p
          className="rounded-2xl border px-4 py-2.5 text-[14px] leading-relaxed"
          style={
            isAgent
              ? {
                  borderColor: "color-mix(in srgb, var(--features-blue) 32%, transparent)",
                  background: "color-mix(in srgb, var(--features-blue) 12%, transparent)",
                  color: "var(--foreground)",
                }
              : {
                  borderColor: "var(--border)",
                  background: "rgba(255,255,255,0.04)",
                  color: "var(--muted-foreground)",
                }
          }
        >
          {entry.text}
        </p>
      </div>
    </div>
  )
}
