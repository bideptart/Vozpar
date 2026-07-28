"use client"

import { motion, useReducedMotion, AnimatePresence } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { Mic, Brain, MessageSquare, Phone, Zap, Globe } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

// ─── Rotating feature scenes in the 3D box ───────────────────────────────────
const FEATURE_SCENES = [
  {
    id: "listen",
    color: "#2d98f1",
    label: "Listening",
    sublabel: "Audio-native processing",
    icon: Mic,
    bars: [0.3, 0.55, 0.8, 1, 0.7, 0.5, 0.9, 0.6, 0.85, 0.45, 0.75, 0.5, 0.65, 0.4, 0.9, 0.6, 0.8, 0.55],
  },
  {
    id: "understand",
    color: "#6366f1",
    label: "Understanding",
    sublabel: "Intent recognition",
    icon: Brain,
    bars: [0.6, 0.35, 0.9, 0.5, 1, 0.7, 0.45, 0.85, 0.6, 0.75, 0.5, 0.9, 0.35, 0.65, 0.8, 0.5, 0.7, 0.4],
  },
  {
    id: "respond",
    color: "#10b981",
    label: "Responding",
    sublabel: "Sub-300ms reply",
    icon: MessageSquare,
    bars: [0.8, 0.6, 0.4, 0.75, 0.55, 0.9, 0.65, 0.45, 1, 0.7, 0.5, 0.8, 0.6, 0.35, 0.75, 0.9, 0.55, 0.7],
  },
  {
    id: "connect",
    color: "#f59e0b",
    label: "Connecting",
    sublabel: "Live tool execution",
    icon: Zap,
    bars: [0.5, 0.9, 0.65, 0.4, 0.8, 0.55, 0.75, 1, 0.45, 0.7, 0.85, 0.5, 0.9, 0.6, 0.35, 0.75, 0.55, 0.8],
  },
]

// ─── Radial waveform ring ────────────────────────────────────────────────────
// Precomputed once at module scope so the values are stable across renders
// (a scene change must not reshuffle the ring). Deterministic pseudo-random
// via trig rather than Math.random(), so server and client agree — otherwise
// this would hydrate-mismatch.
const RADIAL_BAR_COUNT = 64

const RADIAL_BARS = Array.from({ length: RADIAL_BAR_COUNT }).map((_, i) => {
  const wave = Math.abs(Math.sin(i * 0.9)) * 0.6 + Math.abs(Math.cos(i * 0.37)) * 0.4
  const len = 10 + wave * 26
  return {
    angle: (360 / RADIAL_BAR_COUNT) * i,
    len,
    min: 0.3 + (i % 3) * 0.08,
    max: 0.75 + wave * 0.25,
    duration: `${1.5 + (i % 7) * 0.16}s`,
    delay: `${(i % 11) * 0.09}s`,
  }
})

// ─── Animated waveform ───────────────────────────────────────────────────────
function AnimWaveform({ bars, color, reduced }: { bars: readonly number[]; color: string; reduced: boolean }) {
  return (
    <div className="flex items-center gap-[3px]" aria-hidden>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="block rounded-full"
          style={{ width: 3, background: `linear-gradient(to top, ${color}55, ${color})` }}
          animate={reduced
            ? { height: h * 28, opacity: 0.5 }
            : { height: [h * 10, h * 36, h * 14, h * 32, h * 10], opacity: [0.6, 1, 0.65, 0.95, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}
        />
      ))}
    </div>
  )
}

// ─── 3D Voice Illustration (upgraded) ────────────────────────────────────────
function VoiceIllustration({ reduced }: { reduced: boolean }) {
  const [sceneIdx, setSceneIdx] = useState(0)

  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setSceneIdx(i => (i + 1) % FEATURE_SCENES.length), 2800)
    return () => clearInterval(t)
  }, [reduced])

  const scene = FEATURE_SCENES[sceneIdx]
  const SceneIcon = scene.icon

  return (
    <div
      aria-label="AI voice intelligence 3D visualization"
      role="img"
      className="relative flex h-full w-full select-none flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.07] bg-[#000000]"
    >
      {/* Deep background radial glow — changes color with scene */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={{ background: `radial-gradient(60% 60% at 50% 50%, ${scene.color}18 0%, ${scene.color}06 45%, transparent 75%)` }}
        transition={{ duration: 0.9 }}
      />

      {/* Grid pattern overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${scene.color}40 1px, transparent 1px), linear-gradient(90deg, ${scene.color}40 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Two faint guide rings — just enough structure to frame the radial
          waveform without competing with it. */}
      {[168, 246].map((d, n) => (
        <div
          key={d}
          aria-hidden
          className="absolute rounded-full border"
          style={{
            borderColor: `${scene.color}${n === 1 ? "14" : "1f"}`,
            width: d,
            height: d,
            borderStyle: n === 1 ? "dashed" : "solid",
          }}
        />
      ))}

      {/* ── Radial waveform ────────────────────────────────────────────
          The centrepiece: RADIAL_BARS spokes arranged around the orb,
          each scaling on its own cycle so the whole ring breathes like a
          live spectrum analyser. Every spoke animates via the shared
          `.viz-bar` CSS keyframe (transform: scaleY only, GPU-composited),
          and the rotation/placement lives on a separate parent span — a
          single element can't hold both, since .viz-bar owns `transform`. */}
      {RADIAL_BARS.map((b, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -50%) rotate(${b.angle}deg) translateY(-104px)`,
          }}
        >
          <span
            suppressHydrationWarning
            className={reduced ? "block rounded-full" : "viz-bar block rounded-full"}
            style={
              {
                width: 2,
                height: b.len,
                background: `linear-gradient(to top, ${scene.color}00, ${scene.color})`,
                opacity: 0.85,
                // .viz-bar sets will-change:transform, which is a useful hint
                // for a handful of bars but counterproductive across 64 —
                // it would promote 64 separate compositor layers. Transform
                // animations composite fine without the hint.
                willChange: "auto",
                "--viz-bar-origin": "bottom",
                "--viz-bar-min": b.min,
                "--viz-bar-max": b.max,
                "--viz-bar-static": b.max * 0.55,
                "--viz-bar-duration": b.duration,
                "--viz-bar-delay": b.delay,
              } as React.CSSProperties
            }
          />
        </span>
      ))}

      {/* Radar sweep behind the waveform ring. */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            background: `conic-gradient(from 0deg, transparent 0deg, transparent 270deg, ${scene.color}1c 348deg, transparent 360deg)`,
            maskImage: "radial-gradient(circle, transparent 24%, #000 34%, #000 100%)",
            WebkitMaskImage: "radial-gradient(circle, transparent 24%, #000 34%, #000 100%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 13, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Corner frame brackets — reads as an instrument viewport rather
          than a plain rounded box. */}
      {[
        "left-3 top-3 border-l border-t rounded-tl-md",
        "right-3 top-3 border-r border-t rounded-tr-md",
        "left-3 bottom-3 border-l border-b rounded-bl-md",
        "right-3 bottom-3 border-r border-b rounded-br-md",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`pointer-events-none absolute h-5 w-5 ${pos}`}
          style={{ borderColor: `${scene.color}30` }}
        />
      ))}

      {/* Orbiting dot */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="absolute"
          animate={{ rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          style={{ width: 200, height: 200 }}
        >
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 8,
              height: 8,
              top: 0,
              left: "50%",
              marginLeft: -4,
              background: scene.color,
              boxShadow: `0 0 16px ${scene.color}`,
            }}
            animate={{ background: scene.color, boxShadow: `0 0 16px ${scene.color}` }}
            transition={{ duration: 0.9 }}
          />
        </motion.div>
      )}

      {/* Second orbit (reverse) */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="absolute"
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{ width: 150, height: 150 }}
        >
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 5,
              height: 5,
              bottom: 0,
              left: "50%",
              marginLeft: -2.5,
              background: scene.color,
              opacity: 0.6,
              boxShadow: `0 0 10px ${scene.color}`,
            }}
          />
        </motion.div>
      )}

      {/* Centre orb with pulsing glow */}
      <div className="relative z-20 flex flex-col items-center gap-5">
        <motion.div
          className="relative flex items-center justify-center rounded-full"
          animate={reduced ? undefined : {
            boxShadow: [
              `0 0 30px ${scene.color}40, 0 0 60px ${scene.color}20`,
              `0 0 50px ${scene.color}70, 0 0 90px ${scene.color}35`,
              `0 0 30px ${scene.color}40, 0 0 60px ${scene.color}20`,
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 76,
            height: 76,
            // Off-centre highlight + darker lower edge reads as a lit sphere
            // rather than a flat disc, which is what made the old orb look
            // like a placeholder circle.
            background: `radial-gradient(circle at 34% 28%, ${scene.color}, ${scene.color} 38%, color-mix(in srgb, ${scene.color} 62%, #000) 100%)`,
          }}
        >
          {/* Specular highlight */}
          <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(150deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.05) 42%, transparent 62%)" }} />
          {/* Crisp rim light */}
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: `inset 0 1px 1px rgba(255,255,255,0.45), inset 0 -8px 16px -8px rgba(0,0,0,0.6)` }} />

          {/* Scene icon with crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={sceneIdx}
              initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <SceneIcon className="h-7 w-7 text-white" />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Waveform bars — changes with scene */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`wave-${sceneIdx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
          >
            <AnimWaveform bars={scene.bars} color={scene.color} reduced={reduced} />
          </motion.div>
        </AnimatePresence>

        {/* Scene label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`label-${sceneIdx}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-1 text-center"
          >
            <span className="rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em]"
              style={{ borderColor: `${scene.color}40`, color: scene.color, background: `${scene.color}10` }}>
              {scene.label}
            </span>
            <span className="text-[11px] text-white/30">{scene.sublabel}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scene indicator dots */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5">
        {FEATURE_SCENES.map((s, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{ width: i === sceneIdx ? 20 : 6, background: i === sceneIdx ? s.color : "rgba(255,255,255,0.2)" }}
            style={{ height: 6 }}
            transition={{ duration: 0.35 }}
          />
        ))}
      </div>

      {/* Latency chip top-right */}
      <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[9px] text-white/40">&lt;300ms</span>
      </div>

      {/* Pipeline stage rail, top-left — shows the four scenes as a
          progress track so the box communicates a *sequence*, not just a
          single blinking state. */}
      <div className="absolute left-4 top-4 flex flex-col gap-1.5">
        {FEATURE_SCENES.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1.5">
            <motion.span
              className="block h-1.5 rounded-full"
              animate={{
                width: i === sceneIdx ? 14 : 6,
                background: i === sceneIdx ? s.color : "rgba(255,255,255,0.14)",
              }}
              transition={{ duration: 0.35 }}
            />
            <motion.span
              className="font-mono text-[8px] uppercase tracking-[0.16em]"
              animate={{ color: i === sceneIdx ? s.color : "rgba(255,255,255,0.18)" }}
              transition={{ duration: 0.35 }}
            >
              {s.label}
            </motion.span>
          </div>
        ))}
      </div>

      {/* Corner watermark */}
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

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 md:py-20">
        {/* items-stretch (not items-center) + h-full on both children: the
            right column now matches the illustration's height exactly
            instead of being a shorter block floating next to a tall square.
            The max-w cap on the left is gone from lg up so the two columns
            are genuinely equal width. */}
        <div className="grid items-stretch gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Left: 3D illustration. Capped at 420px square — letting it fill
              a half-width column made it ~600px tall on a 1366px laptop,
              which pushed the section past the fold. The cap keeps the whole
              row visible on a standard laptop viewport. */}
          <ScrollReveal className="mx-auto aspect-square w-full max-w-[340px] sm:max-w-[400px] lg:mx-0 lg:max-w-[420px]">
            <VoiceIllustration reduced={Boolean(reduced)} />
          </ScrollReveal>

          {/* Right: copy */}
          <div className="flex h-full flex-col justify-center">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#046bd2]/30 bg-[#046bd2]/[0.08] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#2d98f1]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2d98f1]" />
                Voice intelligence
              </span>
              <h2 className="mt-4 text-balance font-heading text-3xl font-medium leading-[1.06] tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.6rem]">
                A voice agent that{" "}
                <span className="bg-gradient-to-r from-[#2d98f1] to-[#046bd2] bg-clip-text text-transparent">
                  actually listens.
                </span>
              </h2>
              <p className="mt-3.5 text-pretty text-[15px] leading-relaxed text-white/45 lg:text-base">
                Most voice bots transcribe speech, run it through a language model, and synthesise audio back —
                three separate systems stitched together. Vozpar uses a single audio-native model that processes
                voice end-to-end, removing the latency and the artefacts that make bots sound robotic.
              </p>
            </ScrollReveal>

            <div className="mt-5 flex flex-col gap-3.5 sm:mt-6 sm:gap-4">
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
