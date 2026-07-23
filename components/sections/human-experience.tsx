"use client"

import { Waves, Hand, Infinity as InfinityIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"
import { SpotlightPanel } from "@/components/animation/magnetic"

// Went through two passes: SpotlightPanel + tinted icon (too generic/
// template-y), then an asymmetric bento with one tall featured card (too
// much dead space — the waveform bars were also silently invisible, because
// percentage heights on an inline `<span>` don't apply in CSS at all, so
// that card rendered as an empty box). This version keeps the per-card live
// visuals but drops back to three equal, compact cards with fixed-px bar
// heights that actually render, sized to fill the card rather than float in
// a mostly-empty one.
const items = [
  {
    icon: Waves,
    title: "Zero-lag conversations",
    description:
      "Native audio-to-audio modeling delivers natural warmth and real-time fluidity. No robotic dead air, no awkward pauses while a transcription pipeline catches up.",
    tint: "var(--features-blue)",
  },
  {
    icon: Hand,
    title: "Smart interruptions",
    description:
      "Customers can talk over the agent at any moment. It stops, listens, and responds the way a real human would — not the way a chatbot pretends to.",
    tint: "var(--features-green)",
  },
  {
    icon: InfinityIcon,
    title: "Unlimited capacity",
    description:
      "Scale from one call to thousands simultaneously. No busy signals, no queue time, no per-seat math.",
    tint: "var(--features-amber)",
  },
] as const

/** Continuous waveform — demonstrates "zero-lag" with motion, not just an icon. */
function WaveformVisual({ tint, reduced }: { tint: string; reduced: boolean }) {
  const heights = [10, 20, 14, 28, 16, 22, 12]
  return (
    <div className="mt-5 flex items-end justify-center gap-[5px]" aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className={reduced ? "block w-1.5 rounded-full" : "voice-bar block w-1.5 rounded-full"}
          style={{
            height: h,
            background: `linear-gradient(to top, ${tint}, color-mix(in srgb, ${tint} 40%, white))`,
            animationDelay: `${i * 90}ms`,
          }}
        />
      ))}
    </div>
  )
}

/** Two-lane bars, opposite phase — the agent's bar dips exactly when the
 *  caller's bar rises, visualizing a real interruption instead of a static
 *  hand icon. */
function InterruptVisual({ tint, reduced }: { tint: string; reduced: boolean }) {
  return (
    <div className="mt-5 flex flex-col items-center gap-2.5" aria-hidden>
      <div className="flex h-9 items-end justify-center gap-4">
        <motion.div
          className="w-6 rounded-md bg-muted-foreground/25"
          style={{ height: "100%" }}
          animate={reduced ? undefined : { scaleY: [1, 0.3, 1] }}
          transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", times: [0, 0.5, 1] }}
        />
        <motion.div
          className="w-6 rounded-md"
          style={{ height: "100%", background: tint }}
          animate={reduced ? undefined : { scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", times: [0, 0.5, 1] }}
        />
      </div>
      <div className="flex items-center justify-center gap-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/50">
        <span>Agent</span>
        <span style={{ color: tint }}>Caller</span>
      </div>
    </div>
  )
}

/** Rings expanding outward without limit — "unlimited capacity" as motion
 *  rather than an infinity glyph sitting still. */
function ScaleVisual({ tint, reduced }: { tint: string; reduced: boolean }) {
  return (
    <div className="relative mt-5 flex items-center justify-center" aria-hidden>
      <div className="relative flex h-9 w-9 items-center justify-center">
        <span className="absolute h-2.5 w-2.5 rounded-full" style={{ background: tint }} />
        {!reduced &&
          [0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute rounded-full border"
              style={{ borderColor: tint, width: 10, height: 10 }}
              animate={{ scale: [1, 4.5], opacity: [0.6, 0] }}
              transition={{
                duration: 2.6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
                delay: i * 0.85,
              }}
            />
          ))}
      </div>
    </div>
  )
}

export function HumanExperience() {
  const reduced = useReducedMotion()
  return (
    <section id="experience" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-[110px] [will-change:transform]"
        animate={reduced ? undefined : { scale: [1, 1.18, 1] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 md:px-6 md:py-32">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="ai-pill-cyan">
            <span className="h-1 w-1 rounded-full bg-primary" />
            The human-kind experience
          </span>
          <h2 className="mt-6 text-balance font-heading text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-5xl">
            Conversations indistinguishable from{" "}
            <span className="text-primary">your best agent.</span>
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            9278.ai skips the brittle speech-to-text and text-to-speech relay and runs on a single audio-native engine — so
            your callers hear pauses, emotion, and timing that feel right.
          </p>
        </ScrollReveal>

        <StaggerGroup className="mt-16 grid gap-5 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = item.icon
            const Visual = i === 0 ? WaveformVisual : i === 1 ? InterruptVisual : ScaleVisual
            return (
              <StaggerItem key={item.title}>
                <SpotlightPanel
                  glow={item.tint}
                  size={360}
                  className="group/spot flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/30 backdrop-blur-sm transition-[translate,border-color] duration-300 hover:-translate-y-1 hover:border-white/25"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 transition-transform duration-500 group-hover/spot:scale-x-100"
                    style={{
                      background: `linear-gradient(90deg, ${item.tint}, color-mix(in srgb, ${item.tint} 10%, transparent))`,
                    }}
                  />

                  <div className="relative flex h-full flex-col p-6">
                    <div className="flex items-center justify-between">
                      <span
                        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover/spot:-rotate-6 group-hover/spot:scale-105"
                        style={{
                          background: `color-mix(in srgb, ${item.tint} 16%, transparent)`,
                          borderColor: `color-mix(in srgb, ${item.tint} 32%, transparent)`,
                          color: item.tint,
                        }}
                      >
                        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground/50">0{i + 1}</span>
                    </div>
                    <h3 className="mt-5 font-heading text-lg font-medium tracking-[-0.02em] text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

                    <Visual tint={item.tint} reduced={Boolean(reduced)} />
                  </div>
                </SpotlightPanel>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
