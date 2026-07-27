"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link" 
import {
  ArrowRight, PhoneCall, CheckCircle, Zap, Shield,
  Globe2, Calendar, Headphones, TrendingUp, PhoneOutgoing, Moon,
} from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { HeroIndustrialBg } from "@/components/sections/hero-industrial-bg"

// ── Rotating headline words ───────────────────────────────────────────────────
const WORDS = ["Books Appointments", "Closes More Deals", "Handles Support", "Converts Callers", "Never Sleeps"] as const

// ── 3D Scene cards data ───────────────────────────────────────────────────────
const SCENES = [
  {
    icon: Calendar,
    tag: "Appointment Booking",
    title: "Zero Empty Slots",
    metric: "94%",
    metricLabel: "show-up rate",
    fact: "Confirms slots, sends reminders & reschedules on its own — your calendar stays full.",
    color: "#2d98f1",
    particleColor: "#2d98f1",
  },
  {
    icon: Headphones,
    tag: "24/7 Customer Support",
    title: "Instant Resolution",
    metric: "89%",
    metricLabel: "issues resolved on first call",
    fact: "Pulls answers from your docs and CRM. Escalates only the 11% that truly need a human.",
    color: "#6366f1",
    particleColor: "#6366f1",
  },
  {
    icon: TrendingUp,
    tag: "Lead Qualification",
    title: "Hot Leads Only",
    metric: "3.2×",
    metricLabel: "more qualified pipeline",
    fact: "Scores every inbound caller and routes only the ready-to-buy prospects to your closers.",
    color: "#0ea5e9",
    particleColor: "#0ea5e9",
  },
  {
    icon: PhoneOutgoing,
    tag: "Outbound Follow-Up",
    title: "Re-Engage at Scale",
    metric: "43%",
    metricLabel: "re-engagement rate",
    fact: "Reaches cold leads, re-qualifies them, and books demos — while your team focuses on closing.",
    color: "#8b5cf6",
    particleColor: "#8b5cf6",
  },
  {
    icon: Moon,
    tag: "After-Hours Coverage",
    title: "Always On, Always Ready",
    metric: "100%",
    metricLabel: "calls answered, 24 / 7 / 365",
    fact: "No voicemail. No missed revenue. Every caller is handled — even at 3 AM on a holiday.",
    color: "#10b981",
    particleColor: "#10b981",
  },
] as const

const INTERVAL = 3400

// ── Card micro-visualisations ─────────────────────────────────────────────────
// Each of the 5 rotating cards gets its own visual identity — no two reuse the
// same shape. Every bar/element below has a FIXED, unanimated height/size in
// its own box; only `transform: scaleY()` / `scale()` / `rotate()` move, via
// the shared viz-* CSS keyframes (see globals.css — same mechanism the
// Benefits cards use). That's the fix for the up/down jitter: the old
// Waveform animated the `height` style directly inside an auto-height flex
// row, so the row's own box grew and shrank every frame and pushed the
// "Metric" block below it up and down. A transform never changes layout, so
// the row height — and everything below it — now stays perfectly still.
const VIZ_ROW = "flex h-6 items-end gap-[3px]"

/** Card 1 · Appointment Booking — audio waveform, bars anchored to a centre line. */
function AudioWaveformViz({ color, active, reduced }: { color: string; active: boolean; reduced: boolean }) {
  const bars = [0.4, 0.75, 0.5, 1, 0.6, 0.85, 0.45, 0.9, 0.55, 0.7, 0.4, 0.8]
  return (
    <div className="flex h-6 items-center gap-[3px]" aria-hidden>
      {bars.map((h, i) => (
        <span key={i}
          className={reduced ? "block w-[2.5px] rounded-full" : "viz-bar block w-[2.5px] rounded-full"}
          style={{
            height: 22,
            background: color,
            opacity: active ? 0.85 : 0.3,
            "--viz-bar-origin": "center",
            "--viz-bar-min": h * 0.28,
            "--viz-bar-max": h,
            "--viz-bar-static": h * 0.5,
            "--viz-bar-duration": `${1.3 + (i % 4) * 0.15}s`,
            "--viz-bar-delay": `${i * 0.07}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

/** Card 2 · 24/7 Support — segmented equalizer meter, bottom-anchored blocks. */
function EqualizerViz({ color, active, reduced }: { color: string; active: boolean; reduced: boolean }) {
  const cols = [0.5, 0.85, 0.35, 0.95, 0.6, 0.75, 0.42, 0.68, 0.55, 0.9]
  return (
    <div className={VIZ_ROW} aria-hidden>
      {cols.map((f, i) => (
        <span key={i}
          className={reduced ? "block w-[3px] rounded-[1px]" : "viz-bar block w-[3px] rounded-[1px]"}
          style={{
            height: 22,
            background: `linear-gradient(to top, ${color}55, ${color})`,
            opacity: active ? 0.9 : 0.32,
            maskImage: "repeating-linear-gradient(to top, #000 0px, #000 3px, transparent 3px, transparent 5px)",
            WebkitMaskImage: "repeating-linear-gradient(to top, #000 0px, #000 3px, transparent 3px, transparent 5px)",
            "--viz-bar-origin": "bottom",
            "--viz-bar-min": 0.25,
            "--viz-bar-max": f,
            "--viz-bar-static": f * 0.6,
            "--viz-bar-duration": `${1.1 + (i % 5) * 0.18}s`,
            "--viz-bar-delay": `${(i % 6) * 0.09}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

/** Card 3 · Lead Qualification — stepped signal pulse with a travelling charge. */
function SignalPulseViz({ color, active, reduced }: { color: string; active: boolean; reduced: boolean }) {
  const path = "M0 18 H14 V6 H26 V18 H40 V10 H54 V18 H68 V4 H82 V18 H96 V12 H108"
  return (
    <div className="h-6 w-full" aria-hidden style={{ opacity: active ? 0.95 : 0.32 }}>
      <svg viewBox="0 0 108 22" preserveAspectRatio="none" className="h-full w-full">
        <path d={path} fill="none" stroke={color} strokeOpacity="0.3" strokeWidth="1.5" />
        {!reduced && (
          <path className="viz-dash" d={path} pathLength={100} fill="none" stroke={color} strokeWidth="2"
            strokeLinecap="round" style={{ "--viz-dash-duration": "2.6s" } as React.CSSProperties} />
        )}
      </svg>
    </div>
  )
}

/** Card 4 · Outbound Follow-Up — a short chain of pulsing nodes with travelling links. */
function NetworkPulseViz({ color, active, reduced }: { color: string; active: boolean; reduced: boolean }) {
  const nodes = [8, 32, 56, 80, 104]
  return (
    <div className="h-6 w-full" aria-hidden style={{ opacity: active ? 0.95 : 0.32 }}>
      <svg viewBox="0 0 112 22" preserveAspectRatio="none" className="h-full w-full">
        <g stroke={color} strokeOpacity="0.3" strokeWidth="1">
          {nodes.slice(0, -1).map((x, i) => (
            <line key={i} x1={x} y1={11} x2={nodes[i + 1]} y2={11} />
          ))}
        </g>
        {!reduced && (
          <g stroke={color} strokeWidth="1.6" strokeLinecap="round">
            {nodes.slice(0, -1).map((x, i) => (
              <line key={i} className="viz-dash" pathLength={100} x1={x} y1={11} x2={nodes[i + 1]} y2={11}
                style={{ "--viz-dash-duration": `${2 + i * 0.4}s`, "--viz-dash-delay": `${i * 0.35}s` } as React.CSSProperties} />
            ))}
          </g>
        )}
        <g fill={color}>
          {nodes.map((x, i) => (
            <circle key={i} className={reduced ? undefined : "viz-node"} cx={x} cy={11} r="2.4"
              style={{ "--viz-node-duration": `${1.8 + (i % 3) * 0.4}s`, "--viz-node-delay": `${i * 0.22}s` } as React.CSSProperties} />
          ))}
        </g>
      </svg>
    </div>
  )
}

/** Card 5 · After-Hours Coverage — a small radar sweep beside blinking status dots. */
function RadarPulseViz({ color, active, reduced }: { color: string; active: boolean; reduced: boolean }) {
  return (
    <div className="flex h-6 items-center gap-2.5" aria-hidden style={{ opacity: active ? 0.95 : 0.32 }}>
      <span className="relative block h-6 w-6 shrink-0 overflow-hidden rounded-full border" style={{ borderColor: `${color}45` }}>
        <span className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: color }} />
        {!reduced && (
          <span className="viz-radar absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, ${color}00 0deg, ${color}00 270deg, ${color}70 350deg, ${color}00 360deg)`,
              "--viz-radar-duration": "3s",
            } as React.CSSProperties} />
        )}
      </span>
      <span className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className={reduced ? "block h-1.5 w-1.5 rounded-full" : "viz-blink block h-1.5 w-1.5 rounded-full"}
            style={{
              background: color,
              boxShadow: `0 0 5px ${color}`,
              "--viz-blink-duration": `${1.4 + i * 0.3}s`,
              "--viz-blink-delay": `${i * 0.3}s`,
            } as React.CSSProperties} />
        ))}
      </span>
    </div>
  )
}

const CARD_VIZ = [AudioWaveformViz, EqualizerViz, SignalPulseViz, NetworkPulseViz, RadarPulseViz]

// ── 3D Carousel (all cards visible in 3D spread) ──────────────────────────────
function Scene3D({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(0)
  const n = SCENES.length
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setActive(a => (a + 1) % n), INTERVAL)
  }

  useEffect(() => {
    if (reduced) return
    start()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [reduced])

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    setIsMobile(mq.matches)
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", h)
    return () => mq.removeEventListener("change", h)
  }, [])

  const getStyle = (i: number) => {
    const diff = ((i - active + n) % n)
    const angle = diff === 0 ? 0 : diff <= Math.floor(n / 2) ? diff : diff - n

    if (isMobile) {
      return {
        x: 0, z: angle === 0 ? 0 : -300,
        rotateY: 0,
        scale: angle === 0 ? 1 : 0.85,
        opacity: angle === 0 ? 1 : 0,
        zIndex: angle === 0 ? 50 : 10,
      }
    }

    const xMap:  Record<number, number> = { 0: 0, 1: 195, 2: 300, [-1]: -195, [-2]: -300 }
    const zMap:  Record<number, number> = { 0: 0, 1: -90, 2: -200, [-1]: -90, [-2]: -200 }
    const ryMap: Record<number, number> = { 0: 0, 1: -22, 2: -38, [-1]: 22, [-2]: 38 }
    const scMap: Record<number, number> = { 0: 1, 1: 0.78, 2: 0.60, [-1]: 0.78, [-2]: 0.60 }
    const opMap: Record<number, number> = { 0: 1, 1: 0.55, 2: 0.28, [-1]: 0.55, [-2]: 0.28 }
    const zIdx:  Record<number, number> = { 0: 50, 1: 40, 2: 30, [-1]: 40, [-2]: 30 }

    const clamp = (v: number) => Math.max(-2, Math.min(2, v)) as -2 | -1 | 0 | 1 | 2
    const k = clamp(angle)

    return {
      x: xMap[k] ?? 0, z: zMap[k] ?? -200,
      rotateY: ryMap[k] ?? 0, scale: scMap[k] ?? 0.5,
      opacity: opMap[k] ?? 0, zIndex: zIdx[k] ?? 10,
    }
  }

  return (
    <div
      className="relative flex w-full items-center justify-center"
      style={{
        height: isMobile ? 420 : 460,
        perspective: "1100px",
        perspectiveOrigin: "50% 45%",
      }}
    >
      {/* Ambient glow that changes with active card */}
      <motion.div aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl blur-[80px]"
        animate={{ background: `radial-gradient(ellipse at 50% 60%, ${SCENES[active].color}30, transparent 65%)` }}
        transition={{ duration: 0.7 }}
      />

      {/* All cards rendered simultaneously in 3D space */}
      {SCENES.map((card, i) => {
        const Icon = card.icon
        const s = getStyle(i)
        const isFront = i === active

        return (
          <motion.div key={i}
            className="absolute cursor-pointer"
            style={{ transformStyle: "preserve-3d", zIndex: s.zIndex }}
            animate={{ x: s.x, z: s.z, rotateY: s.rotateY, scale: s.scale, opacity: s.opacity }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 150, damping: 28, mass: 1, restDelta: 0.01 }}
            onClick={() => { setActive(i); start() }}
          >
            <div
              className="relative w-[260px] overflow-hidden rounded-2xl border sm:w-[280px]"
              style={{
                // Pure black card surface (was a faintly navy-tinted
                // #0a0d1a → #080b14 gradient) — matches the rest of the
                // Home page's unified black card system.
                background: "linear-gradient(145deg, #050505 0%, #000000 60%, #020202 100%)",
                borderColor: isFront ? `${card.color}45` : "rgba(255,255,255,0.07)",
                boxShadow: isFront
                  ? `0 0 0 1px ${card.color}25, 0 32px 80px -20px ${card.color}35, 0 0 60px -10px ${card.color}20`
                  : "0 8px 32px rgba(0,0,0,0.6)",
              }}
            >
              {/* Top colour bar */}
              <div className="h-[2px] w-full"
                style={{ background: `linear-gradient(90deg, transparent, ${card.color}, transparent)` }} />

              {/* Ambient inner glow */}
              <div className="pointer-events-none absolute inset-0"
                style={{ background: `radial-gradient(ellipse 70% 50% at 50% -10%, ${card.color}16, transparent 65%)` }}
                aria-hidden />

              {/* Shine sweep on active */}
              {isFront && !reduced && (
                <motion.div aria-hidden
                  className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
                  initial={{ left: "-60%" }}
                  animate={{ left: ["-60%", "160%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
                />
              )}

              <div className="p-6">
                {/* Tag + live dot */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em]"
                    style={{ borderColor: `${card.color}30`, color: card.color, background: `${card.color}0e` }}>
                    {card.tag}
                  </span>
                  {isFront && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl border"
                  style={{ borderColor: `${card.color}28`, background: `${card.color}14`, color: card.color }}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Title */}
                <h3 className="mt-4 font-heading text-xl font-semibold tracking-tight text-white">
                  {card.title}
                </h3>

                {/* Fact */}
                <p className="mt-2 text-[13px] leading-relaxed text-white/40">{card.fact}</p>

                {/* Micro-visualisation — a different shape per card (see
                    CARD_VIZ above), each in a fixed-height row so it never
                    reflows the card layout. */}
                <div className="mt-5">
                  {(() => {
                    const Viz = CARD_VIZ[i % CARD_VIZ.length]
                    return <Viz color={card.color} active={isFront} reduced={Boolean(reduced)} />
                  })()}
                </div>

                {/* Metric */}
                <div className="mt-4 flex items-end justify-between border-t border-white/[0.06] pt-4">
                  <div>
                    <p className="font-heading text-3xl font-bold" style={{ color: card.color }}>
                      {card.metric}
                    </p>
                    <p className="mt-0.5 text-[10px] text-white/30">{card.metricLabel}</p>
                  </div>
                  <CheckCircle className="mb-1 h-5 w-5" style={{ color: `${card.color}60` }} />
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* Dot indicators */}
      <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {SCENES.map((s, i) => (
          <button key={i} onClick={() => { setActive(i); start() }}
            aria-label={`Scene ${i + 1}`}
            className="relative overflow-hidden rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]"
            style={{ width: i === active ? 28 : 7, height: 7, background: i === active ? SCENES[active].color : "rgba(255,255,255,0.2)" }}
          >
            {i === active && !reduced && (
              <motion.span key={active}
                className="absolute inset-y-0 left-0 rounded-full bg-white/40"
                initial={{ width: "0%" }} animate={{ width: "100%" }}
                transition={{ duration: INTERVAL / 1000, ease: "linear" }} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── HERO ──────────────────────────────────────────────────────────────────────
export function Hero() {
  const reduced = useReducedMotion()
  const [wordIdx, setWordIdx] = useState(0)

  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2600)
    return () => clearInterval(t)
  }, [reduced])

  return (
    <section className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden bg-black">

      {/* Immersive industrial background — mesh gradients, hex/blueprint grid,
          digital-factory + robotics + cloud silhouettes, neural links,
          holographic particles and pointer parallax. All CSS-keyframe driven. */}
      <HeroIndustrialBg />

      {/* Main 2-col grid */}
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 sm:py-24 md:grid-cols-2 lg:min-h-[calc(100svh-4.5rem)] lg:gap-12 lg:py-0 xl:gap-20">

        {/* ─── LEFT: copy ─────────────────────────────────────────────── */}
        <div className="flex flex-col">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#046bd2]/30 bg-[#046bd2]/[0.08] px-4 py-2">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2d98f1]">
                Vozpar AI · Now Live · Sub-300ms
              </span>
            </div>
          </motion.div>

          {/* Headline with rotating word */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-heading text-[2.6rem] font-medium leading-[1.07] tracking-[-0.035em] text-white sm:text-5xl md:text-[3rem] lg:text-[3.25rem]">
            Your AI Phone Agent
            <br />
            {/* Rotating word */}
            <span className="relative inline-block h-[1.12em] overflow-hidden align-bottom">
              <AnimatePresence mode="wait">
                <motion.span key={wordIdx}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="block bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, #2d98f1 0%, #60b8ff 45%, #2d98f1 100%)" }}>
                  {WORDS[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            <span className="text-white/55">Around the Clock.</span>
          </motion.h1>

          {/* Description */}
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-lg text-base leading-relaxed text-white/45 sm:text-[1.05rem]">
            Plug Vozpar into your existing number today. It answers every call,
            books appointments, qualifies leads, and resolves support — sounding
            completely human, responding in under 300ms, running on your own infrastructure.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex flex-1 flex-wrap items-center gap-3">
            <Link href="/get-started"
              className="group inline-flex flex-1 min-w-[140px] h-12 items-center justify-center gap-2 rounded-full bg-[#046bd2] px-7 text-sm font-semibold text-white shadow-[0_0_28px_rgba(4,107,210,0.45)] transition-all duration-200 hover:bg-[#0579e8] hover:shadow-[0_0_44px_rgba(4,107,210,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]">
              Deploy Your Agent Free
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link href="/features"
              className="inline-flex flex-1 min-w-[140px] h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-7 text-sm font-medium text-white/65 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]">
              <PhoneCall className="h-4 w-4" />
              Hear It In Action
            </Link>
          </motion.div>

          {/* Trust chips */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.52 }}
            className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {[
              { icon: Shield,      text: "Your data, your server" },
              { icon: Globe2,      text: "Works with any carrier"  },
              { icon: Zap,         text: "Live in under an hour"   },
              { icon: CheckCircle, text: "No long-term contract"   },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5 text-xs text-white/28">
                <Icon className="h-3.5 w-3.5 text-[#046bd2]" />
                {text}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ─── RIGHT: 3D scene ───────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center pb-8">
          <Scene3D reduced={Boolean(reduced)} />
        </motion.div>
      </div>

      {/* NOTE: the bottom fade-to-black now lives inside <HeroIndustrialBg />,
          so the scene dissolves *behind* the content rather than a second
          gradient painting over the top of it. */}
    </section>
  )
}
