"use client"

import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { Mic, Brain, MessageSquare } from "lucide-react"

// ─── CSS/SVG placeholder for Image 1 ─────────────────────────────────────────
// Replace <VoiceIllustration /> with a real <Image> when artwork is ready.
// The component accepts the same width/height slot so the layout stays stable.

function VoiceIllustration({ reduced }: { reduced: boolean }) {
  const bars = [
    0.25, 0.5, 0.75, 0.95, 0.8, 0.6, 1, 0.7, 0.85, 0.45, 0.9,
    0.6, 0.75, 0.5, 0.35, 0.65, 0.8, 0.55, 0.4, 0.7,
  ]

  return (
    <div
      aria-label="Abstract voice intelligence illustration — dark background with blue audio waveform"
      role="img"
      className="relative flex h-full w-full select-none items-center justify-center overflow-hidden rounded-2xl border border-white/[0.07] bg-[#030509]"
    >
      {/* Background radial glow */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(4,107,210,0.14) 0%, rgba(4,107,210,0.04) 50%, transparent 80%)" }}
      />

      {/* Concentric rings */}
      {!reduced && [1, 2, 3].map((n) => (
        <motion.div
          key={n}
          aria-hidden
          className="absolute rounded-full border border-[#2d98f1]"
          style={{ width: n * 80, height: n * 80 }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.15, 0.05, 0.15] }}
          transition={{ duration: 4 + n, repeat: Infinity, ease: "easeInOut", delay: n * 0.5 }}
        />
      ))}

      {/* Waveform */}
      <div aria-hidden className="relative z-10 flex items-center gap-[4px]">
        {bars.map((f, i) => (
          <motion.span
            key={i}
            className="block w-[3px] rounded-full"
            style={{ background: `linear-gradient(to top, rgba(4,107,210,0.5), #2d98f1)` }}
            animate={
              reduced
                ? { height: f * 60 }
                : { height: [f * 20, f * 70, f * 30, f * 65, f * 20] }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.08,
            }}
          />
        ))}
      </div>

      {/* Centre orb */}
      <motion.div
        aria-hidden
        className="absolute z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[#046bd2]"
        style={{ boxShadow: "0 0 40px rgba(4,107,210,0.6)" }}
        animate={reduced ? undefined : { scale: [1, 1.07, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Mic className="h-5 w-5 text-white" />
      </motion.div>

      {/* Corner label */}
      <span
        aria-hidden
        className="absolute bottom-3 right-4 font-mono text-[8px] uppercase tracking-[0.2em] text-[#2d98f1]/30"
      >
        vozpar · audio-1
      </span>
    </div>
  )
}

const POINTS = [
  {
    icon: Brain,
    title: "Understands intent, not just words",
    body: "Vozpar's audio model processes tone, hesitation, and phrasing together — so it grasps what a caller means, even when they don't say it perfectly.",
  },
  {
    icon: MessageSquare,
    title: "Manages the full conversation",
    body: "It remembers context across turns, handles topic shifts, and stays on-task through interruptions, redirections, and unexpected questions.",
  },
  {
    icon: Mic,
    title: "Responds with natural rhythm",
    body: "Replies arrive with the right pause length, cadence, and warmth — so callers engage instead of hanging up.",
  },
]

export function ProductStory() {
  const reduced = useReducedMotion()

  return (
    <section id="product-story" className="relative overflow-hidden border-t border-white/[0.06]">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full blur-[160px]"
        style={{ background: "#046bd2", opacity: 0.055 }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left: illustration */}
          <ScrollReveal className="aspect-square w-full max-w-lg lg:max-w-none">
            <VoiceIllustration reduced={Boolean(reduced)} />
          </ScrollReveal>

          {/* Right: copy */}
          <div>
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#046bd2]/30 bg-[#046bd2]/[0.08] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#2d98f1]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2d98f1]" />
                Voice intelligence
              </span>
              <h2 className="mt-5 text-balance font-heading text-4xl font-medium leading-[1.04] tracking-[-0.04em] text-white md:text-5xl">
                A voice agent that{" "}
                <span className="bg-gradient-to-r from-[#2d98f1] to-[#046bd2] bg-clip-text text-transparent">
                  actually listens.
                </span>
              </h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-white/45">
                Most voice bots transcribe speech, run it through a language model, and synthesise audio back —
                three separate systems stitched together. Vozpar uses a single audio-native model that processes
                voice end-to-end, removing the latency and the artefacts that make bots sound robotic.
              </p>
            </ScrollReveal>

            <div className="mt-10 flex flex-col gap-6">
              {POINTS.map((p, i) => {
                const Icon = p.icon
                return (
                  <ScrollReveal key={p.title} delay={0.1 + i * 0.1}>
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2d98f1]/20 bg-[#046bd2]/10 text-[#2d98f1]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{p.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-white/45">{p.body}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
