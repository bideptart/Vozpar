"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, PhoneCall, Sparkles, Mic, Volume2, Cpu, Radio } from "lucide-react"
import { AnimatePresence, animate, motion, useReducedMotion, type Variants } from "@/lib/motion"

/**
 * The call the panel is demoing, cycling on a loop. Previously this was two
 * hardcoded, permanently-static bubbles — the "generating" label and its
 * three dots never actually resolved into anything, so the whole panel read
 * as a screenshot rather than a live agent. Each turn now plays through a
 * caller line → a beat of "generating" → the agent's reply landing, then
 * holds before the next turn replaces it and the footer telemetry (latency/
 * sentiment/intent) updates to match.
 */
const CALL_SCRIPT = [
  {
    callerTime: "00:14",
    caller: "Hi, I'm calling about the listing on Maple Street.",
    agentTime: "00:15",
    agent: "Of course — the 4-bed colonial. Are you looking to schedule a showing this week?",
    intent: "Book showing",
  },
  {
    callerTime: "00:22",
    caller: "Actually, is it free Saturday afternoon?",
    agentTime: "00:23",
    agent: "Saturday at 2 PM works — you're booked, and I've texted the address over.",
    intent: "Showing booked",
  },
  {
    callerTime: "00:31",
    caller: "Perfect, thank you so much!",
    agentTime: "00:32",
    agent: "You're welcome — I'll send a reminder an hour before. Anything else?",
    intent: "Wrapping up",
  },
] as const

const TURN_HOLD_MS = 4200
const GENERATING_DELAY_MS = 950

/** Counts up from 0 to `target` once on mount — the trust-stat number sat
 * there fully formed with no entrance of its own, while everything else in
 * the hero animates in. `delay` lines up with the stat row's own fade-in
 * (see the `transition` on its wrapping motion.div) so the count starts
 * right as the row becomes visible instead of before or well after. */
function AnimatedNumber({ target, delay = 0 }: { target: number; delay?: number }) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(reduced ? target : 0)

  useEffect(() => {
    if (reduced) return
    const controls = animate(0, target, {
      duration: 1.2,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [target, delay, reduced])

  return <>{value}</>
}

export function Hero() {
  const reduced = useReducedMotion()
  const [turn, setTurn] = useState(0)
  const [agentRevealed, setAgentRevealed] = useState(reduced ? true : false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    const audio = new Audio("/hpvoice.mp3")
    audio.preload = "auto"
    audio.load()
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  // Every new turn starts with just the caller line visible and the agent
  // bubble in its "generating" state; after a short beat the reply lands.
  // Reduced-motion users get the resolved reply immediately — the loop
  // itself (turn cycling) still runs, but nothing sits mid-"typing" forever
  // for them.
  useEffect(() => {
    setAgentRevealed(!!reduced)
    if (reduced) return
    const id = setTimeout(() => setAgentRevealed(true), GENERATING_DELAY_MS)
    return () => clearTimeout(id)
  }, [turn, reduced])

  useEffect(() => {
    if (reduced) return
    const id = setTimeout(() => setTurn((t) => (t + 1) % CALL_SCRIPT.length), TURN_HOLD_MS)
    return () => clearTimeout(id)
  }, [turn, reduced])

  const playHoverAudio = () => {
    if (hasPlayedRef.current) return
    const audio = audioRef.current
    if (!audio) return
    hasPlayedRef.current = true
    audio.currentTime = 0
    audio.play().catch(() => {
      hasPlayedRef.current = false
    })
  }

  const word: Variants = {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  }

  const headline = ["AI", "voice", "agents", "that"]

  return (
    <section className="relative overflow-hidden">
      {/* Layered background. The old `bg-grid` layer here was dead weight —
          that class paints nothing site-wide (see globals.css, neutralised
          on an earlier request) — so it was doing literally nothing behind
          the content. Replaced with a real top vignette, the same technique
          used on /industries' hero, confined to the first ~500px so it
          reads as depth behind the headline rather than a wash over the
          whole section. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(45,152,241,0.10),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-neural opacity-50"
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-32 h-[460px] w-[460px] rounded-full blur-[120px] [will-change:transform]"
        style={{ background: "var(--ai-cyan)", opacity: 0.07 }}
        animate={reduced ? undefined : { x: [0, 60, -40, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] rounded-full blur-[120px] [will-change:transform]"
        style={{ background: "var(--ai-magenta)", opacity: 0.05 }}
        animate={reduced ? undefined : { x: [0, -50, 30, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 22, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-4 md:px-6 md:py-6 lg:grid-cols-12 lg:gap-10">
        {/* LEFT: Copy */}
        <div className="lg:col-span-7">
          {/* Status pill — the descriptor clause used to run on the same
              line with no wrap allowed, so on a phone it either overflowed
              the viewport or got clipped by the card's own width. Below
              `sm` it now drops to its own line and the divider hides, so
              "Live · v9278.audio-1" stays a tidy single row and the longer
              claim reads as a second line instead of fighting for space. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-2xl border border-border/60 bg-card/40 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-md sm:rounded-full"
          >
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="font-medium text-foreground/90">Live</span>
              <span className="h-3 w-px bg-border/80" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">v9278.audio-1</span>
            </span>
            <span className="hidden h-3 w-px bg-border/80 sm:block" />
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
              Native audio · Sub-second latency · Self-hosted
            </span>
          </motion.div>

          {/* Headline — Archivo (brand heading face) instead of the legacy
              serif. The serif read as a mismatched, dated accent against
              the rest of the site's sans-only system (already migrated on
              /features); this brings the homepage hero in line with it. The
              accent phrase gets a blue→cyan gradient fill rather than flat
              italic colour, which reads as considerably more "alive" next
              to the live agent panel on the right. */}
          <motion.h1
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.07, delayChildren: 0.2 }}
            className="mt-5 text-balance font-heading text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl"
          >
            {headline.map((w, i) => (
              <motion.span key={`h-${i}`} variants={word} className="mr-3 inline-block">
                {w}
              </motion.span>
            ))}
            <br className="hidden md:block" />
            <motion.span
              variants={word}
              className="mr-3 inline-block bg-gradient-to-r from-[var(--ai-cyan)] to-primary bg-clip-text text-transparent"
            >
              actually
            </motion.span>
            <motion.span
              variants={word}
              className="mr-3 inline-block bg-gradient-to-r from-[var(--ai-cyan)] to-primary bg-clip-text text-transparent"
            >
              sound
            </motion.span>
            <motion.span
              variants={word}
              className="mr-3 inline-block bg-gradient-to-r from-[var(--ai-cyan)] to-primary bg-clip-text text-transparent"
            >
              human.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground"
          >
            Build, launch, and scale voice agents on a self-hosted control panel. Native audio, real interruptions,
            and your own phone numbers — production-ready in an afternoon.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-6 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
          >
            <Button
              size="lg"
              className="group btn-ai relative h-12 w-full overflow-hidden rounded-full px-7 text-primary-foreground transition-all sm:w-auto"
            >
              <span className="relative z-10">Build your first agent</span>
              <ArrowRight
                className="relative z-10 ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group h-12 w-full rounded-full border-border/70 bg-card/30 px-7 backdrop-blur-md hover:border-primary/50 hover:bg-card/50 sm:w-auto"
            >
              <PhoneCall className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" aria-hidden="true" />
              Try the live demo
            </Button>
          </motion.div>

          {/* Trust stats — the numbers used to just appear fully formed
              while everything else in the hero animates in. `<300ms` now
              counts up from 0 on mount (AnimatedNumber above); the other two
              aren't real numbers to count, so they get a matching pop-in
              (blur + scale settling into place) timed to land together,
              rather than sitting there static next to a counting neighbour. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.25 }}
            className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-3 border-t border-border/40 pt-5"
          >
            <div>
              <p className="text-2xl font-semibold tracking-tight text-primary">
                &lt;<AnimatedNumber target={300} delay={1.35} />ms
              </p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Sub-second latency</p>
            </div>
            <div className="hidden h-10 w-px bg-border/60 sm:block" />
            <div>
              <motion.p
                initial={reduced ? false : { opacity: 0, scale: 0.85, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: 1.55, ease: [0.22, 1, 0.36, 1] }}
                className="text-2xl font-semibold tracking-tight text-primary"
              >
                Self-hosted
              </motion.p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Your data, your stack</p>
            </div>
            <div className="hidden h-10 w-px bg-border/60 sm:block" />
            <div>
              <motion.p
                initial={reduced ? false : { opacity: 0, scale: 0.85, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: 1.75, ease: [0.22, 1, 0.36, 1] }}
                className="text-2xl font-semibold tracking-tight text-primary"
              >
                Unlimited
              </motion.p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Concurrent calls</p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Live AI control panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:col-span-5"
        >
          <div
            className="relative ring-gradient rounded-3xl card-glow overflow-hidden"
            onPointerEnter={playHoverAudio}
          >
            {/* Subtle scan line for AI feel */}
            <span className="scan-line" aria-hidden />

            {/* Window-bar / header */}
            <div className="relative flex items-center justify-between border-b border-border/40 bg-background/40 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                agent_session · live
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary ring-1 ring-primary/20">
                <Cpu className="h-3 w-3" />
                v1
              </span>
            </div>

            <div className="p-5 md:p-6">
              {/* Agent identity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* AI orb */}
                  <span className="relative flex h-10 w-10 items-center justify-center">
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "conic-gradient(from 0deg, var(--ai-cyan), var(--ai-violet), var(--ai-magenta), var(--ai-cyan))",
                        filter: "blur(6px)",
                        opacity: 0.7,
                      }}
                    />
                    <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-background">
                      <Radio className="h-3.5 w-3.5 text-primary" />
                    </span>
                  </span>
                  <div>
                    <p className="text-sm font-semibold tracking-tight">Aria · Sales Agent</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      en-US · neural-audio
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-400/20">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  On call
                </span>
              </div>

              {/* Brand nameplate — was a plain 32-bar waveform, which is the
                  generic "this is audio" cliché every voice product reaches
                  for. Same technique as the IVR race section's animated
                  "VOZPAR" nameplate (feature-ivr-race.tsx): letters blur up
                  into place, the settled word breathes with a slow glow, and
                  a shine sweeps across it — looping continuously here rather
                  than once, since there's no "radar resolves" moment gating
                  it on this panel. A few small pulsing bars flank the word
                  so the box still reads as "this is a live call," not just a
                  static logo lockup. */}
              <div className="relative mt-5 flex h-24 items-center justify-center gap-4 overflow-hidden rounded-2xl border border-border/40 bg-background/40 px-6">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-2 mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                />
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute h-14 w-48 rounded-full blur-2xl"
                  style={{ background: "var(--ai-cyan)", opacity: 0.16 }}
                  animate={reduced ? undefined : { opacity: [0.1, 0.22, 0.1] }}
                  transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />

                <div aria-hidden className="hidden items-end gap-[3px] sm:flex">
                  {[10, 22, 14].map((h, i) => (
                    <span
                      key={i}
                      className="voice-bar w-[3px] rounded-full"
                      style={{
                        height: `${h}px`,
                        background: "linear-gradient(to top, var(--ai-cyan), var(--ai-violet))",
                        animationDelay: `${i * 180}ms`,
                      }}
                    />
                  ))}
                </div>

                <div className="relative overflow-hidden">
                  {/* Per-letter brand colors, matching the actual Vozpar
                      logo lockup (each character its own solid hue from the
                      logo palette) instead of one gradient sweeping across
                      the whole word — a continuous sweep reads as a generic
                      "shiny text" effect, whereas fixed per-letter color is
                      what makes this specifically *look like the logo*.
                      First pass used the logo's darker blue (#046bd2) for
                      O/P, which is too close to the dark card background to
                      read clearly — swapped every letter to a brighter,
                      higher-contrast tint, bumped weight to bold, and added a
                      matching text-shadow glow so each letter pops off the
                      surface instead of blending into it. Letters still
                      blur-up into place on load; once settled, each one gets
                      its own slow independent glow pulse (now a shallow
                      opacity dip, not enough to ever look "faded") so the
                      nameplate stays alive without needing a moving
                      gradient. */}
                  <motion.p
                    initial={reduced ? false : "hidden"}
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                    }}
                    className="relative flex font-heading text-3xl font-bold uppercase tracking-[0.06em] sm:text-4xl"
                  >
                    {[
                      { letter: "V", color: "#38bdf8" },
                      { letter: "O", color: "#4f8dfb" },
                      { letter: "Z", color: "#fbbf24" },
                      { letter: "P", color: "#4f8dfb" },
                      { letter: "A", color: "#fb923c" },
                      { letter: "R", color: "#f4525f" },
                    ].map(({ letter, color }, i) => (
                      <motion.span
                        key={i}
                        className={reduced ? undefined : "letter-glow"}
                        style={{
                          color,
                          textShadow: `0 0 4px ${color}55`,
                          animationDelay: `${1 + i * 0.18}s`,
                        }}
                        variants={{
                          hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
                          visible: {
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                          },
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </motion.p>
                </div>

                <div aria-hidden className="hidden items-end gap-[3px] sm:flex">
                  {[14, 22, 10].map((h, i) => (
                    <span
                      key={i}
                      className="voice-bar w-[3px] rounded-full"
                      style={{
                        height: `${h}px`,
                        background: "linear-gradient(to top, var(--ai-violet), var(--ai-magenta))",
                        animationDelay: `${i * 180 + 90}ms`,
                      }}
                    />
                  ))}
                </div>

                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-2 mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-accent/40 to-transparent"
                />
              </div>

              {/* Conversation transcript — cycles through CALL_SCRIPT on a
                  loop instead of sitting on two permanently-static bubbles.
                  Each turn cross-fades in via AnimatePresence (keyed on
                  `turn`), and within a turn the agent bubble genuinely
                  resolves from "generating…" dots into real text rather
                  than showing both at once forever. */}
              <div className="relative mt-5 min-h-[128px] space-y-2.5 text-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={turn}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-2.5"
                  >
                    <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-background/30 p-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card/80 text-muted-foreground ring-1 ring-border/60">
                        <Volume2 className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          Caller · {CALL_SCRIPT[turn].callerTime}
                        </p>
                        <p className="mt-0.5 text-foreground/90">"{CALL_SCRIPT[turn].caller}"</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/[0.04] p-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                        <Mic className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                          Aria · {CALL_SCRIPT[turn].agentTime} · {agentRevealed ? "sent" : "generating"}
                        </p>
                        {agentRevealed ? (
                          <motion.p
                            initial={reduced ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="mt-0.5 text-foreground/90"
                          >
                            "{CALL_SCRIPT[turn].agent}"
                          </motion.p>
                        ) : (
                          <p className="mt-0.5 inline-flex items-center gap-1 text-muted-foreground/70">
                            <span className="dot-float h-1 w-1 rounded-full bg-primary" />
                            <span className="dot-float h-1 w-1 rounded-full bg-primary" style={{ animationDelay: "0.2s" }} />
                            <span className="dot-float h-1 w-1 rounded-full bg-primary" style={{ animationDelay: "0.4s" }} />
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer telemetry — intent updates with the script; latency
                  gets a tiny per-turn flicker so it reads as a live reading
                  rather than a fixed label, and sentiment/intent cross-fade
                  in sync with the transcript above. */}
              <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-border/40 bg-background/30 p-3 text-center">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Latency</p>
                  <motion.p
                    key={`latency-${turn}`}
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-0.5 text-sm font-semibold text-primary"
                  >
                    &lt;{280 + ((turn * 37) % 60)}ms
                  </motion.p>
                </div>
                <div className="border-x border-border/40">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Sentiment</p>
                  <p className="mt-0.5 text-sm font-semibold text-emerald-400">Positive</p>
                </div>
                <div className="overflow-hidden">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Intent</p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`intent-${turn}`}
                      initial={reduced ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="mt-0.5 text-sm font-semibold text-foreground"
                    >
                      {CALL_SCRIPT[turn].intent}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Floating chips */}
          <motion.div
            aria-hidden
            className="absolute -left-6 top-32 hidden rounded-full border border-border/60 bg-card/80 px-3 py-1.5 text-xs font-medium backdrop-blur-md md:flex md:items-center md:gap-2"
            animate={reduced ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            CRM updated
          </motion.div>
          <motion.div
            aria-hidden
            className="absolute -right-4 bottom-24 hidden rounded-full border border-border/60 bg-card/80 px-3 py-1.5 text-xs font-medium backdrop-blur-md md:flex md:items-center md:gap-2"
            animate={reduced ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
          >
            <span className="h-2 w-2 rounded-full bg-accent" />
            Calendar booked
          </motion.div>
        </motion.div>
      </div>

      {/* Carrier trust strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="relative border-t border-border/40 bg-background/50 py-6"
      >
        <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Connect your carrier account in two clicks
        </p>
        <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-muted-foreground/90">
          Phone numbers, SIP trunks, and inbound routing flow through the carrier you already know and trust — your numbers, your billing, unchanged.
        </p>
      </motion.div>
    </section>
  )
}
