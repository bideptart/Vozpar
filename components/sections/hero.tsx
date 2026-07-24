"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight, PhoneCall, CheckCircle, Zap, Shield,
  Globe2, Calendar, Headphones, TrendingUp, PhoneOutgoing, Moon,
} from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { animate } from "motion/react"

// ── Rotating headline words ───────────────────────────────────────────────────
const WORDS = ["Books Appointments", "Qualifies Leads", "Handles Support", "Drives Revenue", "Works 24/7"] as const

// ── 3D Carousel cards data ────────────────────────────────────────────────────
const CARDS = [
  {
    icon: Calendar,
    tag: "Booking",
    title: "Fills Every Slot",
    metric: "94%",
    metricLabel: "booking rate",
    fact: "Checks calendar, confirms slot, sends SMS — zero staff needed.",
    color: "#2d98f1",
    accent: "#1a7fc4",
  },
  {
    icon: Headphones,
    tag: "Support",
    title: "Resolves Instantly",
    metric: "87%",
    metricLabel: "first-call resolution",
    fact: "Answers from your knowledge base. Escalates only when truly needed.",
    color: "#6366f1",
    accent: "#4f46e5",
  },
  {
    icon: TrendingUp,
    tag: "Leads",
    title: "Qualifies & Routes",
    metric: "3×",
    metricLabel: "qualified lead lift",
    fact: "Scores inbound leads and sends hot prospects straight to your team.",
    color: "#0ea5e9",
    accent: "#0284c7",
  },
  {
    icon: PhoneOutgoing,
    tag: "Outbound",
    title: "Follows Up at Scale",
    metric: "41%",
    metricLabel: "re-engagement rate",
    fact: "Calls dormant leads and confirms appointments automatically.",
    color: "#8b5cf6",
    accent: "#7c3aed",
  },
  {
    icon: Moon,
    tag: "After-Hours",
    title: "Never Misses a Call",
    metric: "100%",
    metricLabel: "after-hours capture",
    fact: "Every caller is greeted and helped — even at 3 AM.",
    color: "#10b981",
    accent: "#059669",
  },
] as const

const INTERVAL = 3200

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

// ── Waveform ──────────────────────────────────────────────────────────────────
const BH = [0.4, 0.75, 0.5, 1, 0.6, 0.85, 0.45, 0.9, 0.55, 0.7, 0.4, 0.8, 0.6]
function Waveform({ color, active, reduced }: { color: string; active: boolean; reduced: boolean }) {
  return (
    <div className="flex items-center gap-[3px]" aria-hidden>
      {BH.map((h, i) => (
        <motion.span key={i} className="block w-[2.5px] rounded-full" style={{ background: color }}
          animate={!reduced && active
            ? { height: [h * 6, h * 22, h * 10, h * 20, h * 6], opacity: 0.85 }
            : { height: h * 8, opacity: 0.3 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.07 }} />
      ))}
    </div>
  )
}

// ── 3D CAROUSEL ───────────────────────────────────────────────────────────────
function Carousel3D({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(0)
  const n = CARDS.length
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

  // isMobile: on small screens only show front card (no 3D spread)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    setIsMobile(mq.matches)
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", h)
    return () => mq.removeEventListener("change", h)
  }, [])

  // Position each card in 3D space
  const getStyle = (i: number) => {
    const diff = ((i - active + n) % n)
    const angle = diff === 0 ? 0 : diff <= Math.floor(n / 2) ? diff : diff - n

    if (isMobile) {
      // On mobile: stack cards, only front visible
      return {
        x: 0, z: angle === 0 ? 0 : -300,
        rotateY: 0,
        scale: angle === 0 ? 1 : 0.85,
        opacity: angle === 0 ? 1 : 0,
        zIndex: angle === 0 ? 50 : 10,
      }
    }

    const xMap:  Record<number, number> = { 0: 0, 1: 200, 2: 310, [-1]: -200, [-2]: -310 }
    const zMap:  Record<number, number> = { 0: 0, 1: -80, 2: -180, [-1]: -80, [-2]: -180 }
    const ryMap: Record<number, number> = { 0: 0, 1: -22, 2: -38, [-1]: 22, [-2]: 38 }
    const scMap: Record<number, number> = { 0: 1, 1: 0.80, 2: 0.62, [-1]: 0.80, [-2]: 0.62 }
    const opMap: Record<number, number> = { 0: 1, 1: 0.60, 2: 0.30, [-1]: 0.60, [-2]: 0.30 }
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
        animate={{ background: `radial-gradient(ellipse at 50% 60%, ${CARDS[active].color}30, transparent 65%)` }}
        transition={{ duration: 0.7 }}
      />

      {/* Cards */}
      {CARDS.map((card, i) => {
        const Icon = card.icon
        const s = getStyle(i)
        const isFront = i === active

        return (
          <motion.div key={i}
            className="absolute cursor-pointer"
            style={{ transformStyle: "preserve-3d", zIndex: s.zIndex }}
            animate={{ x: s.x, z: s.z, rotateY: s.rotateY, scale: s.scale, opacity: s.opacity }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 26 }}
            onClick={() => { setActive(i); start() }}
          >
            {/* Card shell — 280px wide */}
            <div
              className="relative w-[260px] overflow-hidden rounded-2xl border sm:w-[280px]"
              style={{
                background: "linear-gradient(145deg, #0a0d1a 0%, #060810 60%, #080b14 100%)",
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
                  animate={{ left: ["−60%", "160%"] }}
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

                {/* Waveform */}
                <div className="mt-5">
                  <Waveform color={card.color} active={isFront} reduced={reduced} />
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
        {CARDS.map((card, i) => (
          <button key={i} onClick={() => { setActive(i); start() }}
            aria-label={`Card ${i + 1}`}
            className="relative overflow-hidden rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]"
            style={{ width: i === active ? 28 : 7, height: 7, background: i === active ? CARDS[active].color : "rgba(255,255,255,0.2)" }}
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
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:min-h-screen lg:grid-cols-2 lg:gap-12 lg:py-0 xl:gap-20">

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
            {/* Rotating word — slides up like a ticker */}
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
            className="mt-8 flex flex-wrap gap-3">
            <Link href="/get-started"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#046bd2] px-7 text-sm font-semibold text-white shadow-[0_0_28px_rgba(4,107,210,0.45)] transition-all duration-200 hover:bg-[#0579e8] hover:shadow-[0_0_44px_rgba(4,107,210,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]">
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link href="/features"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-7 text-sm font-medium text-white/65 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]">
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
                  {/* Number */}
                  <p className="font-heading text-2xl font-bold tabular-nums text-white sm:text-3xl lg:text-4xl">
                    <span className="text-[#2d98f1]">{s.pre}</span>
                    <span className="text-white">
                      <Counter to={s.val} suffix="" delay={0.8 + i * 0.12} />
                    </span>
                    <span className="text-[#2d98f1]">{s.suf}</span>
                  </p>
                  {/* Divider */}
                  <span className="mt-2 block h-[2px] w-8 rounded-full bg-[#046bd2]/60" />
                  {/* Label */}
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-white/40 sm:text-[11px]">
                    {s.lab}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── RIGHT: 3D carousel ──────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center pb-8">
          <Carousel3D reduced={Boolean(reduced)} />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
        style={{ background: "linear-gradient(to bottom, transparent, #000)" }} />
    </section>
  )
}
