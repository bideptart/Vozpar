"use client"

import { useEffect, useRef, useState } from "react"
import { PhoneForwarded, Globe2, ShieldCheck, ArrowLeftRight, Layers } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

// ─── Static seed data (no Math.random during render) ────────────────────────
const SEED_SERIES = [
  62, 71, 58, 85, 74, 90, 68, 82, 55, 77,
  88, 64, 79, 92, 61, 84, 70, 96, 66, 80,
  75, 88, 60, 93, 72,
]

const LIVE_CALLS = [
  { flag: "🇺🇸", city: "New York",  dur: "01:14", region: "+1" },
  { flag: "🇬🇧", city: "London",    dur: "00:48", region: "+44" },
  { flag: "🇮🇳", city: "Mumbai",    dur: "00:07", region: "+91" },
  { flag: "🇩🇪", city: "Berlin",    dur: "02:01", region: "+49" },
]

/** Catmull-Rom to cubic-bezier smooth SVG path */
function smoothPath(pts: readonly [number, number][]) {
  if (pts.length < 2) return ""
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`
  }
  return d
}

function MiniWave({ seed }: { seed: number }) {
  const bars = [0.5, 0.9, 0.4, 0.75, 0.6, 0.95, 0.45]
  return (
    <div className="flex h-3.5 items-center gap-[2px]" aria-hidden>
      {bars.map((f, i) => (
        <motion.span
          key={i}
          className="block w-[2px] rounded-full bg-[#2d98f1]"
          style={{ height: `${35 + f * 65}%` }}
          animate={{ scaleY: [f, 1, 0.4, 0.85, f] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: (i + seed) * 0.09 }}
        />
      ))}
    </div>
  )
}

function NetworkActivity() {
  const reduced = useReducedMotion()
  const W = 300
  const H = 100
  const phase = useRef(SEED_SERIES.length)
  const [data, setData] = useState<number[]>(SEED_SERIES)
  const [callsToday, setCallsToday] = useState(14_203)

  useEffect(() => {
    if (reduced) return
    const next = (i: number) => {
      const base = 55 + Math.sin(i * 0.55) * 26 + Math.sin(i * 0.23) * 12
      return Math.max(16, Math.min(104, base + (((i * 7919) % 17) - 8)))
    }
    const id = setInterval(() => {
      setData(prev => [...prev.slice(1), next(phase.current++)])
      setCallsToday(c => c + Math.floor(((phase.current * 1301) % 11) + 2))
    }, 1600)
    return () => clearInterval(id)
  }, [reduced])

  const step = W / (data.length - 1)
  const pts = data.map((v, i) => [i * step, H - (v / 120) * (H - 12) - 6] as [number, number])
  const line = smoothPath(pts)
  const area = `${line} L${W},${H} L0,${H} Z`
  const last = pts[pts.length - 1]

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#060912]"
      style={{ boxShadow: "0 0 0 1px rgba(45,152,241,0.06), 0 24px 60px -20px rgba(0,0,0,0.7)" }}
    >
      {/* Radial glow overlay */}
      <div aria-hidden className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_70%_0%,rgba(4,107,210,0.12),transparent_55%)]" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2d98f1] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2d98f1]" />
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
                Network · live
              </span>
            </div>
            <p className="mt-2 text-xs text-white/30">Calls handled today</p>
            <p className="font-heading text-2xl font-medium tabular-nums text-white">
              {callsToday.toLocaleString()}
              <span className="ml-2 text-xs font-normal text-[#10b981]">▲ 14%</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <span className="font-mono text-[9px] text-[#2d98f1]/60">100+ regions</span>
            <span className="font-mono text-[9px] text-[#10b981]/60">99.9% uptime</span>
          </div>
        </div>

        {/* Live chart */}
        <div className="relative mt-4 h-24">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="carrierArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(45,152,241,0.30)" />
                <stop offset="100%" stopColor="rgba(45,152,241,0)" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map(g => (
              <line key={g} x1="0" y1={H * g} x2={W} y2={H * g} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}
            <motion.path fill="url(#carrierArea)"
              animate={{ d: area }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            <motion.path fill="none" stroke="#2d98f1" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"
              animate={{ d: line }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            <motion.circle r="3" fill="#7dd3fc"
              animate={{ cx: last[0], cy: last[1] }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            <motion.circle r="3" fill="none" stroke="#7dd3fc"
              animate={{ cx: last[0], cy: last[1], scale: [1, 2.8], opacity: [0.5, 0] }}
              transition={{
                cx: { duration: 1.2, ease: "easeInOut" },
                cy: { duration: 1.2, ease: "easeInOut" },
                scale: { duration: 1.8, repeat: Infinity },
                opacity: { duration: 1.8, repeat: Infinity },
              }}
              style={{ transformOrigin: `${last[0]}px ${last[1]}px` }}
            />
          </svg>
        </div>

        {/* KPIs */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: "Latency",  value: "240ms", accent: true },
            { label: "Regions",  value: "100+",  accent: false },
            { label: "Uptime",   value: "99.9%", accent: true },
          ].map(k => (
            <div key={k.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-center"
            >
              <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/25">{k.label}</p>
              <p className={`mt-0.5 text-sm font-semibold ${k.accent ? "text-[#2d98f1]" : "text-white"}`}>
                {k.value}
              </p>
            </div>
          ))}
        </div>

        {/* Active calls */}
        <div className="mt-3 overflow-hidden rounded-xl border border-white/[0.06]">
          <div className="flex items-center justify-between border-b border-white/[0.05] px-3 py-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/25">Active calls</span>
            <span className="flex items-center gap-1 rounded-full bg-[#2d98f1]/12 px-2 py-0.5 font-mono text-[8px] font-semibold text-[#2d98f1]">
              <span className="h-1 w-1 rounded-full bg-[#2d98f1]" />
              {LIVE_CALLS.length}
            </span>
          </div>
          {LIVE_CALLS.map((call, i) => (
            <div key={call.city} className="flex items-center gap-2.5 border-b border-white/[0.04] px-3 py-2 last:border-0">
              <span className="w-5 shrink-0 text-xs">{call.flag}</span>
              <span className="flex-1 truncate text-[11px] text-white/70">{call.city}</span>
              <MiniWave seed={i} />
              <span className="font-mono text-[9px] tabular-nums text-white/30">{call.dur}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const FEATURES = [
  { icon: PhoneForwarded, title: "Bring your own number",    body: "Connect your existing carrier account in two clicks. Numbers, billing, and porting rights stay exactly where they are." },
  { icon: ArrowLeftRight, title: "Inbound and outbound",     body: "One number handles both directions. Accept incoming calls or launch outbound campaigns from the same agent and dashboard." },
  { icon: Globe2,         title: "Global availability",      body: "Route calls across 100+ regions with carrier-grade reliability — no geographic lock-in, no forced migration." },
  { icon: ShieldCheck,    title: "Carrier-grade voice quality", body: "Your provider's network carries every call. Vozpar handles the intelligence layer; you keep the quality and the relationship." },
  { icon: Layers,         title: "No number migration",      body: "Never port a number to use Vozpar. Your numbers stay with your carrier — we simply route the audio through the agent." },
]

export function Carrier() {
  return (
    <section id="carrier" className="relative overflow-hidden border-t border-white/[0.06]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px]"
        style={{ background: "radial-gradient(50% 50% at 50% 0%, rgba(4,107,210,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left: copy */}
          <div>
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#046bd2]/30 bg-[#046bd2]/[0.08] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#2d98f1]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2d98f1]" />
                Phone numbers
              </span>
              <h2 className="mt-5 text-balance font-heading text-4xl font-medium leading-[1.04] tracking-[-0.04em] text-white md:text-5xl">
                Your number stays
                <br />
                <span className="bg-gradient-to-r from-[#2d98f1] to-[#046bd2] bg-clip-text text-transparent">
                  exactly where it is.
                </span>
              </h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-white/45">
                We do not sell phone numbers or require you to port away from your carrier.
                Connect your existing account, and every inbound and outbound call routes
                through Vozpar instantly — with zero downtime.
              </p>
            </ScrollReveal>

            <StaggerGroup className="mt-8 flex flex-col gap-3">
              {FEATURES.map((f) => {
                const Icon = f.icon
                return (
                  <StaggerItem key={f.title}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      className="group flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-[#07090f] p-4 transition-colors hover:border-[#046bd2]/30"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2d98f1]/20 bg-[#046bd2]/10 text-[#2d98f1]">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                        <p className="mt-0.5 text-sm leading-relaxed text-white/40">{f.body}</p>
                      </div>
                    </motion.div>
                  </StaggerItem>
                )
              })}
            </StaggerGroup>
          </div>

          {/* Right: live network visual */}
          <ScrollReveal className="relative lg:sticky lg:top-24">
            <NetworkActivity />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
