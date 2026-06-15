"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, PhoneCall, Sparkles, Mic, Volume2, Cpu, Radio } from "lucide-react"
import { motion, useReducedMotion, type Variants } from "motion/react"

export function Hero() {
  const reduced = useReducedMotion()
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
      {/* Layered background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
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

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-10 md:px-6 md:py-14 lg:grid-cols-12 lg:gap-10">
        {/* LEFT: Copy */}
        <div className="lg:col-span-7">
          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-card/40 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-medium text-foreground/90">Live</span>
            <span className="h-3 w-px bg-border/80" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              v9278.audio-1
            </span>
            <span className="h-3 w-px bg-border/80" />
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Native audio · Sub-second latency · Self-hosted
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.07, delayChildren: 0.2 }}
            className="mt-5 text-balance text-4xl font-serif font-normal leading-[1.02] tracking-tight sm:text-5xl md:text-6xl"
          >
            {headline.map((w, i) => (
              <motion.span key={`h-${i}`} variants={word} className="mr-3 inline-block">
                {w}
              </motion.span>
            ))}
            <br className="hidden md:block" />
            <motion.span variants={word} className="mr-3 inline-block italic text-primary">
              actually
            </motion.span>
            <motion.span variants={word} className="mr-3 inline-block italic text-primary">
              sound
            </motion.span>
            <motion.span variants={word} className="mr-3 inline-block italic text-primary">
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
            className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
          >
            <Button
              size="lg"
              className="group btn-ai relative h-12 overflow-hidden rounded-full px-7 text-primary-foreground transition-all"
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
              className="group h-12 rounded-full border-border/70 bg-card/30 px-7 backdrop-blur-md hover:border-primary/50 hover:bg-card/50"
            >
              <PhoneCall className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" aria-hidden="true" />
              Try the live demo
            </Button>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.25 }}
            className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-3 border-t border-border/40 pt-5"
          >
            <div>
              <p className="text-2xl font-semibold tracking-tight text-primary">&lt;300ms</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Sub-second latency</p>
            </div>
            <div className="hidden h-10 w-px bg-border/60 sm:block" />
            <div>
              <p className="text-2xl font-semibold tracking-tight text-primary">Self-hosted</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Your data, your stack</p>
            </div>
            <div className="hidden h-10 w-px bg-border/60 sm:block" />
            <div>
              <p className="text-2xl font-semibold tracking-tight text-primary">Unlimited</p>
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

              {/* Voice waveform */}
              <div className="relative mt-5 flex h-24 items-center justify-center gap-[3px] overflow-hidden rounded-2xl border border-border/40 bg-background/40 px-6">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-2 mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                />
                {Array.from({ length: 32 }).map((_, i) => {
                  const heights = [18, 32, 56, 24, 70, 44, 88, 52, 30, 64, 42, 76, 22, 60]
                  const h = heights[i % heights.length]
                  return (
                    <span
                      key={i}
                      className="voice-bar w-[3px] rounded-full"
                      style={{
                        height: `${h}%`,
                        background:
                          "linear-gradient(to top, var(--ai-cyan), var(--ai-violet) 60%, var(--ai-magenta))",
                        animationDelay: `${(i * 60) % 900}ms`,
                        animationDuration: `${900 + (i % 5) * 120}ms`,
                      }}
                    />
                  )
                })}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-2 mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-accent/40 to-transparent"
                />
              </div>

              {/* Conversation transcript */}
              <div className="mt-5 space-y-2.5 text-sm">
                <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-background/30 p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card/80 text-muted-foreground ring-1 ring-border/60">
                    <Volume2 className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Caller · 00:14
                    </p>
                    <p className="mt-0.5 text-foreground/90">
                      "Hi, I'm calling about the listing on Maple Street."
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/[0.04] p-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                    <Mic className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                      Aria · 00:15 · generating
                    </p>
                    <p className="mt-0.5 text-foreground/90">
                      "Of course — the 4-bed colonial. Are you looking to schedule a showing this week?"
                      <span className="ml-1 inline-flex items-center gap-0.5 align-middle">
                        <span className="dot-float h-1 w-1 rounded-full bg-primary" />
                        <span
                          className="dot-float h-1 w-1 rounded-full bg-primary"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <span
                          className="dot-float h-1 w-1 rounded-full bg-primary"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer telemetry */}
              <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-border/40 bg-background/30 p-3 text-center">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Latency</p>
                  <p className="mt-0.5 text-sm font-semibold text-primary">218 ms</p>
                </div>
                <div className="border-x border-border/40">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Sentiment</p>
                  <p className="mt-0.5 text-sm font-semibold text-emerald-400">Positive</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Intent</p>
                  <p className="mt-0.5 text-sm font-semibold text-accent">Book showing</p>
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
