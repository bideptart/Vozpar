"use client"

import { useEffect, useRef, useState } from "react"
import { Globe2, PhoneForwarded, ShieldCheck } from "lucide-react"
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

const items = [
  {
    icon: PhoneForwarded,
    title: "Bring your own number",
    description:
      "Already have a carrier account? Connect it and your existing numbers route through 9278.ai instantly — no porting, no downtime.",
  },
  {
    icon: Globe2,
    title: "Inbound and outbound",
    description:
      "One number, both directions. Trigger outbound campaigns or answer every incoming call automatically — same dashboard, same agent.",
  },
  {
    icon: ShieldCheck,
    title: "Carrier-grade voice",
    description:
      "Your provider's global network carries the call. We handle the brain. You keep the relationship, the billing, and the porting rights.",
  },
]

// Recent routed calls shown in the dashboard's live activity list.
const liveCalls = [
  { flag: "+1", city: "New York", dur: "00:42" },
  { flag: "+44", city: "London", dur: "01:15" },
  { flag: "+91", city: "Mumbai", dur: "00:08" },
]

// A lively sample value for step `i` of the live feed: a rolling wave (two
// sines at different rates) with a little noise, kept in a mid band so the
// curve always has visible hills and valleys instead of drifting flat.
function waveAt(i: number) {
  const base = 55 + Math.sin(i * 0.55) * 26 + Math.sin(i * 0.23) * 12
  return Math.max(16, Math.min(104, base + (Math.random() * 10 - 5)))
}
const POINTS = 26
const series = Array.from({ length: POINTS }, (_, i) => waveAt(i))

/** Builds a smooth (Catmull-Rom → cubic-bezier) SVG path through the points,
 *  so the chart reads as a polished analytics curve rather than a jagged
 *  polyline. */
function smoothPath(pts: readonly (readonly [number, number])[]) {
  if (pts.length < 2) return ""
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
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
    <div className="flex h-4 items-center gap-[2px]" aria-hidden>
      {bars.map((f, i) => (
        <motion.span
          key={i}
          className="block w-[2px] rounded-full bg-primary"
          style={{ height: `${40 + f * 60}%` }}
          animate={{ scaleY: [f, 1, 0.4, 0.85, f] }}
          transition={{
            duration: 1.1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: (i + seed) * 0.09,
          }}
        />
      ))}
    </div>
  )
}

/** KPI tile with a cursor-tracking 3D tilt, a glow that follows the pointer,
 *  a border that lights up on hover, and a slow looping shimmer sweep so it
 *  reads as "alive" even at rest. */
function KpiTile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), { stiffness: 200, damping: 18 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-8, 8]), { stiffness: 200, damping: 18 })
  const glowX = useTransform(px, (v) => `${v * 100}%`)
  const glowY = useTransform(py, (v) => `${v * 100}%`)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 600 }}
      className="group/tile relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.03] p-3 transition-colors duration-300 hover:border-primary/40"
    >
      {/* pointer-follow glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100"
        style={{ background: useTransform([glowX, glowY], ([x, y]) => `radial-gradient(120px circle at ${x} ${y}, rgba(45,152,241,0.22), transparent 70%)`) }}
      />
      {/* looping shimmer sweep */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-y-2 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
        animate={{ left: ["-60%", "160%"] }}
        transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", repeatDelay: 1.5 }}
      />
      <div style={{ transform: "translateZ(20px)" }}>
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className={`mt-1 text-lg font-semibold tracking-tight ${accent ? "text-primary" : "text-foreground"}`}>
          {value}
        </p>
      </div>
    </motion.div>
  )
}

/** Right-side visual: a live-looking analytics dashboard (replaces the world
 *  map). Built from an SVG area chart that draws itself in on scroll, KPI
 *  tiles, and a live activity list with mini waveforms — all on the brand's
 *  black + blue surface. */
function NetworkDashboard() {
  const reduced = useReducedMotion()
  const W = 320
  const H = 120

  // Live-updating data: every tick the oldest point drops off and a fresh
  // one arrives on the right (gently trending up with noise), so the line
  // scrolls like an incoming feed instead of sitting frozen. The headline
  // "calls handled" counter ticks up alongside it.
  const [data, setData] = useState<number[]>(series)
  const [calls, setCalls] = useState(12847)
  const phase = useRef(POINTS)

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => {
      setData((prev) => [...prev.slice(1), waveAt(phase.current++)])
      setCalls((c) => c + Math.floor(Math.random() * 12) + 3)
    }, 1400)
    return () => clearInterval(id)
  }, [reduced])

  // Fixed 0–120 scale (not data-relative) so the wave keeps its shape and
  // never re-normalises to a flat line when the values happen to bunch up.
  const stepX = W / (data.length - 1)
  const pts = data.map((v, i) => [i * stepX, H - (v / 120) * (H - 16) - 8] as const)
  const line = smoothPath(pts)
  const area = `${line} L${W},${H} L0,${H} Z`
  const lastPoint = pts[pts.length - 1]

  return (
    <div
      className="ring-gradient relative flex w-full overflow-hidden rounded-3xl card-glow"
      style={{ background: "linear-gradient(165deg, #0c1119, #060810)" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(4,107,210,0.14),transparent_55%)]" />

      <div className="relative flex w-full flex-col p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Network activity · live
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Calls handled today</p>
            <p className="text-3xl font-semibold tabular-nums tracking-tight">
              {calls.toLocaleString()}
              <span className="ml-2 align-middle text-xs font-medium text-primary">▲ 18.2%</span>
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary">9278.ai</span>
        </div>

        {/* Area chart — grows a little to absorb the small height difference
            so the dashboard bottom lines up with the left column. */}
        <div className="relative mt-3 min-h-[96px] flex-1">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="dashArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(45,152,241,0.35)" />
                <stop offset="100%" stopColor="rgba(45,152,241,0)" />
              </linearGradient>
            </defs>
            {/* gridlines */}
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1="0" y1={H * g} x2={W} y2={H * g} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            ))}
            {/* Area + line tween their `d` on every data tick, so the graph
                slides smoothly as new points arrive instead of jumping. */}
            <motion.path
              fill="url(#dashArea)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, d: area }}
              transition={{ opacity: { duration: 0.8, delay: 0.5 }, d: { duration: 1.4, ease: "easeInOut" } }}
            />
            <motion.path
              fill="none"
              stroke="#2d98f1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, d: line }}
              animate={{ pathLength: 1, d: line }}
              transition={{ pathLength: { duration: 1.2, ease: "easeInOut" }, d: { duration: 1.4, ease: "easeInOut" } }}
            />
            {/* Leading dot rides the newest point with a live pulse. */}
            <motion.circle
              r="3.5"
              fill="#7dd3fc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, cx: lastPoint[0], cy: lastPoint[1] }}
              transition={{ opacity: { delay: 1.3 }, cx: { duration: 1.4, ease: "easeInOut" }, cy: { duration: 1.4, ease: "easeInOut" } }}
            />
            <motion.circle
              r="3.5"
              fill="none"
              stroke="#7dd3fc"
              animate={{ cx: lastPoint[0], cy: lastPoint[1], scale: [1, 2.6], opacity: [0.6, 0] }}
              transition={{
                cx: { duration: 1.4, ease: "easeInOut" },
                cy: { duration: 1.4, ease: "easeInOut" },
                scale: { duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" },
                opacity: { duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" },
              }}
              style={{ transformOrigin: `${lastPoint[0]}px ${lastPoint[1]}px` }}
            />
          </svg>
        </div>

        {/* KPI tiles — 3D tilt + hover glow + looping shimmer */}
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          <KpiTile label="Regions" value="100+" />
          <KpiTile label="Latency" value="240ms" accent />
          <KpiTile label="Uptime" value="99.99%" accent />
        </div>

        {/* Live activity list */}
        <div className="mt-3 overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
          <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Live calls</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-primary">
              <span className="h-1 w-1 rounded-full bg-primary" />
              {liveCalls.length} active
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {liveCalls.map((call, i) => (
              <div key={call.city} className="flex items-center gap-2.5 px-3 py-2">
                <span className="w-7 shrink-0 font-mono text-[10px] font-semibold text-primary">{call.flag}</span>
                <span className="flex-1 truncate text-[11px] text-foreground/85">{call.city}</span>
                <MiniWave seed={i} />
                <span className="w-9 shrink-0 text-right font-mono text-[9px] tabular-nums text-muted-foreground/70">
                  {call.dur}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Connectivity() {
  return (
    <section className="relative overflow-hidden border-t border-border/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
        {/* Left column is the taller one; the dashboard stretches to match it
            (items-stretch) and its chart flex-grows to fill — now that the
            heading/cards are compact this is only a small growth, so both
            sides line up top and bottom without blowing the chart up. */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          {/* LEFT: Copy + items */}
          <div className="lg:col-span-6">
            <ScrollReveal>
              <span className="ai-pill-cyan">
                <Globe2 className="h-3 w-3" />
                Phone numbers
              </span>
              <h2 className="mt-5 text-balance font-heading text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-[2.75rem]">
                Your number, live{" "}
                <span className="text-primary">this afternoon.</span>
              </h2>
              <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
                We don't sell phone numbers. We connect to the carrier you already use — two clicks, zero porting delay,
                and your numbers, billing, and rights stay exactly where they are.
              </p>
            </ScrollReveal>

            <StaggerGroup className="mt-6 flex flex-col gap-2.5">
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <StaggerItem key={item.title}>
                    <motion.div
                      className="group card-glow relative flex items-start gap-4 rounded-2xl p-4"
                      whileHover={{ x: 6 }}
                      transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-semibold tracking-tight transition-colors group-hover:text-primary">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.div>
                  </StaggerItem>
                )
              })}
            </StaggerGroup>
          </div>

          {/* RIGHT: Live analytics dashboard — no map. An animated area chart
              of calls handled, KPI tiles, and a live-status footer, styled as
              a real product surface. */}
          <ScrollReveal className="flex lg:col-span-6">
            <NetworkDashboard />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
