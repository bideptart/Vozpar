"use client"

import { Waves, Hand, Database, Server, Zap, Globe } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

// ─── Mini visuals ─────────────────────────────────────────────────────────────

function WaveViz({ reduced, color = "#2d98f1" }: { reduced: boolean; color?: string }) {
  const bars = [0.4, 0.7, 0.5, 1, 0.6, 0.85, 0.45, 0.9, 0.55, 0.75, 0.4, 0.8]
  return (
    <div className="flex h-14 items-center gap-[4px]" aria-hidden>
      {bars.map((f, i) => (
        <motion.span key={i}
          className="block w-[3px] rounded-full"
          style={{ background: `linear-gradient(to top, color-mix(in srgb, ${color} 45%, transparent), ${color}, color-mix(in srgb, ${color} 60%, transparent))` }}
          animate={reduced ? { height: f * 28 } : {
            height: [f * 12, f * 34, f * 18, f * 30, f * 14, f * 32, f * 12],
            opacity: [0.65, 1, 0.7, 0.95, 0.6, 1, 0.65],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.11,
            times: [0, 0.18, 0.36, 0.54, 0.72, 0.9, 1],
          }}
        />
      ))}
    </div>
  )
}

function InterruptViz({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex h-14 flex-col justify-center gap-2.5 px-1" aria-hidden>
      {/* User speaking */}
      <motion.div className="flex items-center gap-2"
        animate={reduced ? undefined : {
          opacity: [1, 1, 0.25, 1, 1],
          scaleX: [1, 1, 0.96, 1, 1],
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", times: [0, 0.35, 0.42, 0.5, 1] }}
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#2d98f1]/30" />
        <span className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-[#2d98f1]/12 via-[#2d98f1]/20 to-[#2d98f1]/8" />
        <span className="h-1.5 w-1/3 rounded-full bg-gradient-to-r from-[#2d98f1]/10 to-transparent" />
      </motion.div>
      {/* Agent interrupting (amber) */}
      <div className="flex items-center justify-end gap-2">
        <motion.span className="h-1.5 rounded-full"
          style={{
            transformOrigin: "right",
            background: "linear-gradient(to right, transparent, #f59e0b, #fbbf24)",
          }}
          animate={reduced ? { width: 72 } : {
            width: [0, 0, 0, 72, 72, 0],
            opacity: [0, 0, 0.4, 1, 1, 0.1],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut", times: [0, 0.3, 0.4, 0.55, 0.8, 1] }}
        />
        <motion.span className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: "#f59e0b", boxShadow: "0 0 8px rgba(245,158,11,0.4)" }}
          animate={reduced ? undefined : {
            scale: [1, 1, 1, 1.4, 1],
            opacity: [0.5, 0.5, 0.5, 1, 0.6],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

function ScaleViz({ reduced, color = "#2d98f1" }: { reduced: boolean; color?: string }) {
  const cols = [35, 55, 42, 72, 58, 88, 65, 80]
  return (
    <div className="flex h-14 items-end gap-1.5 px-1" aria-hidden>
      {cols.map((h, i) => (
        <motion.span key={i} className="w-3.5 rounded-t"
          style={{
            background: `linear-gradient(to top, color-mix(in srgb, ${color} 40%, transparent), ${color}, color-mix(in srgb, ${color} 80%, transparent))`,
            boxShadow: `0 0 8px color-mix(in srgb, ${color} 20%, transparent)`,
          }}
          animate={reduced ? { height: h * 0.5 } : {
            height: [h * 0.2, h * 0.58, h * 0.3, h * 0.62, h * 0.22],
            y: [0, -2, 0, -1, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
            repeatType: "mirror",
          }}
        />
      ))}
    </div>
  )
}

function PulseNodesViz({ reduced, color = "#2d98f1" }: { reduced: boolean; color?: string }) {
  const nodes = [0, 1, 2, 3, 4]
  return (
    <div className="flex h-14 items-center gap-2.5 px-1" aria-hidden>
      {nodes.map((_, i) => (
        <div key={i} className="flex items-center">
          <motion.span
            className="block h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: color, boxShadow: `0 0 8px color-mix(in srgb, ${color} 45%, transparent)` }}
            animate={reduced ? { scale: 1, opacity: 0.85 } : {
              scale: [1, 1.35, 1],
              opacity: [0.45, 1, 0.45],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.11 }}
          />
          {i < nodes.length - 1 && (
            <span
              className="h-px w-3.5"
              style={{ background: `color-mix(in srgb, ${color} 30%, transparent)` }}
            />
          )}
        </div>
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
    tint: "#2d98f1", viz: "scale",
  },
  {
    icon: Server, title: "Self-hosted by default",
    body: "Deploy on your own infrastructure. Call data, transcripts, and business knowledge stay inside your environment.",
    tint: "#10b981", viz: "nodes",
  },
  {
    icon: Globe, title: "Multilingual, auto-detected",
    body: "Detects the caller's language instantly and switches mid-conversation — no separate models, no manual configuration.",
    tint: "#2d98f1", viz: "wave",
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
      initial={reduced ? undefined : { opacity: 0, y: 18, filter: "blur(6px)" }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={reduced ? undefined : { y: -6, scale: 1.008 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
        mass: 0.9,
      }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#08090e] p-6 md:p-7 transition-all duration-300 hover:border-[#046bd2]/40 hover:shadow-[0_0_40px_-12px_rgba(4,107,210,0.25)] ${className}`}
    >
      {/* Top accent bar */}
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${tint}55, transparent)` }} />

      {/* Hover inner glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${tint}18 0%, transparent 70%)`,
        }}
      />

      {/* Shine sweep on hover */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 opacity-0 group-hover:opacity-100"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
          initial={{ left: "-40%" }}
          whileHover={{ left: ["-40%", "140%"] }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      )}

      {/* Icon container */}
      <motion.div
        className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border"
        whileHover={{ scale: 1.1, rotate: -4 }}
        transition={{ type: "spring", stiffness: 380, damping: 20 }}
        style={{ borderColor: `${tint}22`, background: `${tint}10`, color: tint }}
      >
        <Icon className="h-5 w-5" />
      </motion.div>

      {/* Mini viz */}
      {viz && (
        <div className="mb-5">
          {viz === "wave" && <WaveViz reduced={reduced} color={tint} />}
          {viz === "interrupt" && <InterruptViz reduced={reduced} />}
          {viz === "scale" && <ScaleViz reduced={reduced} color={tint} />}
          {viz === "nodes" && <PulseNodesViz reduced={reduced} color={tint} />}
        </div>
      )}

      <h3 className="font-heading text-[1.05rem] font-medium tracking-tight text-white transition-colors duration-300 group-hover:text-white">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-white/40 transition-colors duration-300 group-hover:text-white/55">{body}</p>
    </motion.div>
  )
}

export function Benefits() {
  const reduced = useReducedMotion()
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06]">
      {/* Top radial glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[500px]"
        style={{ background: "radial-gradient(60% 70% at 50% 0%, rgba(4,107,210,0.12) 0%, rgba(4,107,210,0.04) 40%, transparent 75%)" }} />

      {/* Subtle dot grid background */}
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      )}

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:py-20">
        <ScrollReveal className="mx-auto mb-8 md:mb-10 max-w-2xl text-center">
          <p className="mb-3 md:mb-4 font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[#2d98f1]">Why Vozpar</p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-medium leading-tight tracking-tight text-white lg:text-5xl">
            Built for real calls,
            <br className="hidden sm:block" />{" "}
            <span className="text-white/60">not demo videos.</span>
          </h2>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg leading-relaxed text-white/40">
            Every design choice optimises for the moment a real caller hears a real response.
          </p>
        </ScrollReveal>

        <StaggerGroup className="grid gap-3 sm:gap-4 md:gap-5 lg:grid-cols-12">
          {MAIN.map(c => (
            <StaggerItem key={c.title} className={c.span}>
              <BentoCard icon={c.icon} title={c.title} body={c.body}
                tint={c.tint} viz={c.viz} reduced={Boolean(reduced)} className="h-full" />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <StaggerGroup className="mt-3 sm:mt-4 md:mt-5 grid gap-3 sm:gap-4 md:gap-5 sm:grid-cols-2 md:grid-cols-3">
          {SECONDARY.map(c => (
            <StaggerItem key={c.title}>
              <BentoCard icon={c.icon} title={c.title} body={c.body}
                tint={c.tint} viz={c.viz} reduced={Boolean(reduced)} className="h-full" />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
