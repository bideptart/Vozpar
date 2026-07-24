"use client"

import { Waves, Hand, Database, Server, Zap, Globe } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

// ─── Mini visuals ─────────────────────────────────────────────────────────────

function WaveViz({ reduced }: { reduced: boolean }) {
  const bars = [0.4, 0.7, 0.5, 1, 0.6, 0.85, 0.45, 0.9, 0.55, 0.75, 0.4, 0.8]
  return (
    <div className="flex h-14 items-center gap-[4px]" aria-hidden>
      {bars.map((f, i) => (
        <motion.span key={i}
          className="block w-[3px] rounded-full"
          style={{ background: `linear-gradient(to top, rgba(4,107,210,0.4), #2d98f1)` }}
          animate={reduced ? { height: f * 28 } : { height: [f * 10, f * 32, f * 16, f * 28, f * 10] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.09 }}
        />
      ))}
    </div>
  )
}

function InterruptViz({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex h-14 flex-col justify-center gap-2.5 px-1" aria-hidden>
      <motion.div className="flex items-center gap-2"
        animate={reduced ? undefined : { opacity: [1, 0.18, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.45, 1] }}
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-white/20" />
        <span className="h-1.5 flex-1 rounded-full bg-white/12" />
        <span className="h-1.5 w-1/3 rounded-full bg-white/8" />
      </motion.div>
      <div className="flex items-center justify-end gap-2">
        <motion.span className="h-1.5 rounded-full bg-amber-400/50"
          style={{ transformOrigin: "right" }}
          animate={reduced ? { width: 72 } : { width: [0, 72] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2.6, ease: "easeOut" }}
        />
        <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />
      </div>
    </div>
  )
}

function ScaleViz({ reduced }: { reduced: boolean }) {
  const cols = [35, 55, 42, 72, 58, 88, 65, 80]
  return (
    <div className="flex h-14 items-end gap-1.5 px-1" aria-hidden>
      {cols.map((h, i) => (
        <motion.span key={i} className="w-3.5 rounded-t"
          style={{ background: `linear-gradient(to top, rgba(4,107,210,0.35), #2d98f1)` }}
          animate={reduced ? { height: h * 0.5 } : { height: [h * 0.28, h * 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.12, repeatType: "reverse" }}
        />
      ))}
    </div>
  )
}

// ─── Card data ────────────────────────────────────────────────────────────────

const MAIN = [
  {
    icon: Waves, title: "Zero-lag conversations",
    body: "A single audio-native model processes voice end-to-end — no speech-to-text pipeline, no TTS relay. Callers hear natural tone, pacing, and warmth.",
    tint: "#2d98f1", viz: "wave", span: "lg:col-span-4",
  },
  {
    icon: Hand, title: "Handles interruptions naturally",
    body: "Customers cut in mid-sentence every call. Vozpar pauses, processes the new direction, and responds without losing context — exactly like a skilled human agent.",
    tint: "#2d98f1", viz: "interrupt", span: "lg:col-span-4",
  },
  {
    icon: Zap, title: "Sub-300ms responses",
    body: "End-to-end audio processing under 300ms. No dead air, no awkward pauses — callers feel heard the moment they finish speaking.",
    tint: "#2d98f1", viz: "scale", span: "lg:col-span-4",
  },
]

const SECONDARY = [
  {
    icon: Database, title: "Connects to your knowledge base",
    body: "Point the agent at your FAQs, product docs, or CRM. It answers from your source of truth — not generic AI guesswork.",
    tint: "#2d98f1",
  },
  {
    icon: Server, title: "Self-hosted by default",
    body: "Deploy on your own infrastructure. Call data, transcripts, and business knowledge stay inside your environment.",
    tint: "#10b981",
  },
  {
    icon: Globe, title: "Multilingual, auto-detected",
    body: "Detects the caller's language instantly and switches mid-conversation — no separate models, no manual configuration.",
    tint: "#2d98f1",
  },
]

function BentoCard({
  icon: Icon, title, body, tint, viz, reduced, className = "",
}: {
  icon: React.ElementType; title: string; body: string
  tint: string; viz?: string | null; reduced: boolean; className?: string
}) {
  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -3 }}
      transition={{ type: "spring", stiffness: 340, damping: 28 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#08090e] p-7 transition-colors duration-300 hover:border-[#046bd2]/30 ${className}`}
    >
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${tint}55, transparent)` }} />
      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(60% 50% at 50% 0%, ${tint}08, transparent)` }} />

      {/* Icon */}
      <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border"
        style={{ borderColor: `${tint}22`, background: `${tint}10`, color: tint }}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Mini viz */}
      {viz && (
        <div className="mb-5">
          {viz === "wave" && <WaveViz reduced={reduced} />}
          {viz === "interrupt" && <InterruptViz reduced={reduced} />}
          {viz === "scale" && <ScaleViz reduced={reduced} />}
        </div>
      )}

      <h3 className="font-heading text-[1.05rem] font-medium tracking-tight text-white">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-white/40">{body}</p>
    </motion.div>
  )
}

export function Benefits() {
  const reduced = useReducedMotion()
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[400px]"
        style={{ background: "radial-gradient(50% 50% at 50% 0%, rgba(4,107,210,0.07), transparent 70%)" }} />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <ScrollReveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-[#2d98f1]">Why Vozpar</p>
          <h2 className="font-heading text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl">
            Built for real calls,
            <br className="hidden sm:block" />{" "}
            <span className="text-white/60">not demo videos.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/40">
            Every design choice optimises for the moment a real caller hears a real response.
          </p>
        </ScrollReveal>

        <StaggerGroup className="grid gap-3 lg:grid-cols-12">
          {MAIN.map(c => (
            <StaggerItem key={c.title} className={c.span}>
              <BentoCard icon={c.icon} title={c.title} body={c.body}
                tint={c.tint} viz={c.viz} reduced={Boolean(reduced)} className="h-full" />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <StaggerGroup className="mt-3 grid gap-3 sm:grid-cols-3">
          {SECONDARY.map(c => (
            <StaggerItem key={c.title}>
              <BentoCard icon={c.icon} title={c.title} body={c.body}
                tint={c.tint} viz={null} reduced={Boolean(reduced)} className="h-full" />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
