"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight, PhoneCall, CheckCircle, Zap, Shield,
  Globe2, Calendar, Headphones, TrendingUp, PhoneOutgoing, Moon, Mic,
} from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { animate } from "motion/react"

// ── Rotating headline words ───────────────────────────────────────────────────
const WORDS = ["Books Appointments", "Qualifies Leads", "Handles Support", "Drives Revenue", "Works 24/7"] as const

// ── 3D Scene cards data ───────────────────────────────────────────────────────
const SCENES = [
  {
    icon: Calendar,
    tag: "Booking",
    title: "Fills Every Slot",
    metric: "94%",
    metricLabel: "booking rate",
    fact: "Checks calendar, confirms slot, sends SMS — zero staff needed.",
    color: "#2d98f1",
    bg: "from-[#0a1628] to-[#060d1f]",
    particleColor: "#2d98f1",
  },
  {
    icon: Headphones,
    tag: "Support",
    title: "Resolves Instantly",
    metric: "87%",
    metricLabel: "first-call resolution",
    fact: "Answers from your knowledge base. Escalates only when truly needed.",
    color: "#6366f1",
    bg: "from-[#0d0a28] to-[#07051a]",
    particleColor: "#6366f1",
  },
  {
    icon: TrendingUp,
    tag: "Leads",
    title: "Qualifies & Routes",
    metric: "3×",
    metricLabel: "qualified lead lift",
    fact: "Scores inbound leads and sends hot prospects straight to your team.",
    color: "#0ea5e9",
    bg: "from-[#061520] to-[#030d18]",
    particleColor: "#0ea5e9",
  },
  {
    icon: PhoneOutgoing,
    tag: "Outbound",
    title: "Follows Up at Scale",
    metric: "41%",
    metricLabel: "re-engagement rate",
    fact: "Calls dormant leads and confirms appointments automatically.",
    color: "#8b5cf6",
    bg: "from-[#100a28] to-[#07051a]",
    particleColor: "#8b5cf6",
  },
  {
    icon: Moon,
    tag: "After-Hours",
    title: "Never Misses a Call",
    metric: "100%",
    metricLabel: "after-hours capture",
    fact: "Every caller is greeted and helped — even at 3 AM.",
    color: "#10b981",
    bg: "from-[#061a14] to-[#031009]",
    particleColor: "#10b981",
  },
] as const

const INTERVAL = 3400

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = "", delay = 0 }: { to: number; suffix?: string; delay?: number }) {
  const reduced = useReducedMotion()
  const [val, setVal] = useState(reduced ? to : 0)
  useEffect(() => {
    if (reduced) return
    const c = animate(0, to, { duration: 1.6, delay, ease: [0.16, 1, 0.3, 1], onUpdate: v => setVal(Math.round(v)) })
    return () => c.stop()
  }, [to, delay, reduced])
  return <>{val}{suffix}</>
}

// ── Floating Particles ────────────────────────────────────────────────────────
function Particle({ color, reduced }: { color: string; reduced: boolean }) {
  const count = 12
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const r = 95 + (i % 3) * 28
        const x = 50 + Math.cos(angle) * (r / 2.2)
        const y = 50 + Math.sin(angle) * (r / 2.8)
        const size = 2 + (i % 3)
        const delay = i * 0.22
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              background: color,
              boxShadow: `0 0 ${size * 4}px ${color}`,
            }}
            animate={reduced ? undefined : {
              opacity: [0.15, 0.9, 0.15],
              scale: [0.8, 1.6, 0.8],
              y: [0, -8, 0, 8, 0],
            }}
            transition={{
              duration: 3.5 + (i % 3) * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          />
        )
      })}
    </div>
  )
}

// ── Orbiting Ring ─────────────────────────────────────────────────────────────
function OrbitRing({ r, color, duration, reduced }: { r: number; color: string; duration: number; reduced: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden
      animate={reduced ? undefined : { rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <div
        className="rounded-full border"
        style={{
          width: r * 2,
          height: r * 2,
          borderColor: `${color}25`,
          borderStyle: "dashed",
          borderWidth: 1,
        }}
      />
      {/* Dot on the ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 6,
          height: 6,
          background: color,
          boxShadow: `0 0 12px ${color}`,
          top: `calc(50% - ${r}px - 3px)`,
          left: "calc(50% - 3px)",
        }}
      />
    </motion.div>
  )
}

// ── Waveform bars ─────────────────────────────────────────────────────────────
const BH = [0.4, 0.75, 0.5, 1, 0.6, 0.85, 0.45, 0.9, 0.55, 0.7, 0.4, 0.8, 0.6, 0.72, 0.5, 0.88]
function Waveform({ color, reduced }: { color: string; reduced: boolean }) {
  return (
    <div className="flex items-center gap-[2.5px]" aria-hidden>
      {BH.map((h, i) => (
        <motion.span key={i} className="block w-[2px] rounded-full" style={{ background: color }}
          animate={reduced
            ? { height: h * 8, opacity: 0.4 }
            : { height: [h * 6, h * 24, h * 10, h * 22, h * 6], opacity: [0.6, 1, 0.7, 0.95, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.065 }} />
      ))}
    </div>
  )
}

// ── 3D Floating Scene ─────────────────────────────────────────────────────────
function Scene3D({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const n = SCENES.length

  const start = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setActive(a => (a + 1) % n), INTERVAL)
  }

  useEffect(() => {
    if (reduced) return
    start()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [reduced])

  const scene = SCENES[active]
  const Icon = scene.icon

  return (
    <div className="relative flex h-[480px] w-full items-center justify-center" style={{ perspective: "900px" }}>

      {/* Ambient background glow — changes with scene */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        animate={{ background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${scene.color}22 0%, transparent 65%)` }}
        transition={{ duration: 0.8 }}
        aria-hidden
      />

      {/* Outer orbit rings */}
      <OrbitRing r={160} color={scene.color} duration={18} reduced={reduced} />
      <OrbitRing r={120} color={scene.color} duration={12} reduced={reduced} />

      {/* Floating particles */}
      <AnimatePresence mode="wait">
        <motion.div key={`particles-${active}`} className="absolute inset-0"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}>
          <Particle color={scene.color} reduced={reduced} />
        </motion.div>
      </AnimatePresence>

      {/* Central 3D card with tilt float */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 0.72, rotateX: 25, rotateY: -20, y: 40 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.72, rotateX: -25, rotateY: 20, y: -40 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative z-20 w-[300px]"
        >
          {/* 3D depth shadow layer */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              transform: "translateZ(-20px) translateY(18px) scale(0.92)",
              background: `${scene.color}18`,
              filter: "blur(20px)",
              borderRadius: 24,
            }}
            animate={reduced ? undefined : { opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />

          {/* Floating animation */}
          <motion.div
            animate={reduced ? undefined : { y: [0, -12, 0, 12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="relative overflow-hidden rounded-3xl border"
              style={{
                background: `linear-gradient(145deg, #0c1020 0%, #07090f 60%, #0a0d18 100%)`,
                borderColor: `${scene.color}40`,
                boxShadow: `
                  0 0 0 1px ${scene.color}20,
                  0 24px 80px -12px ${scene.color}35,
                  0 0 80px -20px ${scene.color}25,
                  inset 0 1px 0 rgba(255,255,255,0.06)
                `,
              }}
            >
              {/* Top colour bar */}
              <div className="h-[2px] w-full"
                style={{ background: `linear-gradient(90deg, transparent, ${scene.color}, transparent)` }} />

              {/* Shine sweep */}
              {!reduced && (
                <motion.div aria-hidden
                  className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.055), transparent)" }}
                  animate={{ left: ["-60%", "160%"] }}
                  transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
                />
              )}

              {/* Inner ambient glow */}
              <div className="pointer-events-none absolute inset-0"
                style={{ background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${scene.color}12, transparent 65%)` }}
                aria-hidden />

              <div className="p-7">
                {/* Tag + live dot */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em]"
                    style={{ borderColor: `${scene.color}35`, color: scene.color, background: `${scene.color}0e` }}>
                    {scene.tag}
                  </span>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                </div>

                {/* Icon orb */}
                <div className="mt-6 flex items-center gap-3">
                  <motion.div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border"
                    style={{ borderColor: `${scene.color}30`, background: `${scene.color}18`, color: scene.color, boxShadow: `0 0 24px ${scene.color}22` }}
                    animate={reduced ? undefined : { scale: [1, 1.05, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Icon className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <p className="font-heading text-2xl font-bold" style={{ color: scene.color }}>
                      {scene.metric}
                    </p>
                    <p className="text-[10px] text-white/30">{scene.metricLabel}</p>
                  </div>
                </div>

                {/* Title */}
                <h3 className="mt-5 font-heading text-xl font-semibold tracking-tight text-white">
                  {scene.title}
                </h3>

                {/* Fact */}
                <p className="mt-2 text-[13px] leading-relaxed text-white/40">{scene.fact}</p>

                {/* Waveform */}
                <div className="mt-5">
                  <Waveform color={scene.color} reduced={reduced} />
                </div>

                {/* Bottom bar */}
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/20">
                    vozpar · live
                  </span>
                  <CheckCircle className="h-4 w-4" style={{ color: `${scene.color}70` }} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2">
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

  const STATS = [
    { pre: "<", val: 300, suf: "ms",  lab: "Latency"   },
    { pre: "",  val: 99,  suf: ".9%", lab: "Uptime"    },
    { pre: "",  val: 30,  suf: "+",   lab: "Languages" },
  ]

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">

      {/* Background atmosphere */}
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-[700px] w-[700px] -translate-y-1/4 translate-x-1/4"
        style={{ background: "radial-gradient(circle, rgba(4,107,210,0.20) 0%, transparent 65%)" }} />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[500px] -translate-x-1/4 translate-y-1/4"
        style={{ background: "radial-gradient(circle, rgba(4,107,210,0.09) 0%, transparent 65%)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.032]"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.65) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

      {/* Main 2-col grid */}
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 sm:py-24 md:grid-cols-2 lg:min-h-screen lg:gap-12 lg:py-0 xl:gap-20">

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
                AI Voice Platform · Native Audio
              </span>
            </div>
          </motion.div>

          {/* Headline with rotating word */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 font-heading text-[2.6rem] font-medium leading-[1.07] tracking-[-0.035em] text-white sm:text-5xl md:text-[3.2rem] lg:text-[3.6rem]">
            AI Voice Agent That
            <br />
            {/* Rotating word */}
            <span className="relative inline-block h-[1.12em] overflow-hidden align-bottom">
              <AnimatePresence mode="wait">
                <motion.span key={wordIdx}
                  initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="block bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, #2d98f1 0%, #60b8ff 45%, #2d98f1 100%)" }}>
                  {WORDS[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            <span className="text-white/55">For Your Business</span>
          </motion.h1>

          {/* Description */}
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-lg text-base leading-relaxed text-white/45 sm:text-[1.05rem]">
            Vozpar connects to your existing phone numbers and handles real
            conversations — with sub-300ms latency, no transcription pipeline,
            and full data ownership on your own infrastructure.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-1 flex-wrap items-center gap-3">
            <Link href="/get-started"
              className="group inline-flex flex-1 min-w-[140px] h-12 items-center justify-center gap-2 rounded-full bg-[#046bd2] px-7 text-sm font-semibold text-white shadow-[0_0_28px_rgba(4,107,210,0.45)] transition-all duration-200 hover:bg-[#0579e8] hover:shadow-[0_0_44px_rgba(4,107,210,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]">
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link href="/features"
              className="inline-flex flex-1 min-w-[140px] h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-7 text-sm font-medium text-white/65 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]">
              <PhoneCall className="h-4 w-4" />
              See How It Works
            </Link>
          </motion.div>

          {/* Trust chips */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.52 }}
            className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
            {[
              { icon: Shield,      text: "Self-hosted"       },
              { icon: Globe2,      text: "Bring your number" },
              { icon: Zap,         text: "No setup fees"     },
              { icon: CheckCircle, text: "No contracts"      },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5 text-xs text-white/28">
                <Icon className="h-3.5 w-3.5 text-[#046bd2]" />
                {text}
              </span>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="mt-9 border-t border-white/[0.08] pt-7"
          >
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {STATS.map((s, i) => (
                <div key={s.lab} className="flex flex-col">
                  <p className="font-heading text-2xl font-bold tabular-nums text-white sm:text-3xl lg:text-4xl">
                    <span className="text-[#2d98f1]">{s.pre}</span>
                    <span className="text-white">
                      <Counter to={s.val} suffix="" delay={0.8 + i * 0.12} />
                    </span>
                    <span className="text-[#2d98f1]">{s.suf}</span>
                  </p>
                  <span className="mt-2 block h-[2px] w-8 rounded-full bg-[#046bd2]/60" />
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-white/40 sm:text-[11px]">
                    {s.lab}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── RIGHT: 3D scene ───────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center pb-8">
          <Scene3D reduced={Boolean(reduced)} />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
        style={{ background: "linear-gradient(to bottom, transparent, #000)" }} />
    </section>
  )
}
