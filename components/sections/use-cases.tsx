"use client"

import { useEffect, useState } from "react"
import {
  Calendar, Headphones, TrendingUp, PhoneOutgoing, Package, Moon,
  CheckCircle2, ArrowUpRight, Sparkles, Activity, ShieldCheck, PhoneCall, Zap, Play
} from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { CaseViz, CASE_VIZ_LABEL, type CaseVizKind } from "@/components/sections/use-case-visuals"

const CASES = [
  {
    id: "booking",
    icon: Calendar,
    label: "Appointment Booking",
    tag: "Calendar Automation",
    headline: "Books every available slot without double-booking.",
    description: "Callers request a time. Vozpar checks live calendar availability, presents open slots, confirms the appointment, updates your CRM, and sends an instant SMS reminder.",
    objective: "Fill 100% of calendar openings automatically with zero staff effort",
    steps: [
      "Caller asks for preferred date & time",
      "Agent queries calendar API in real time",
      "Slot selected, confirmed & locked in",
      "Instant SMS reminder sent to caller",
    ],
    metric: { label: "Booking Completion Rate", value: "94%", change: "+28% vs human desk" },
    tint: "#2d98f1",
    viz: "calendar" as CaseVizKind,
    audioWave: [0.35, 0.7, 0.45, 0.9, 0.6, 0.8, 0.4, 0.75, 0.95, 0.5, 0.85, 0.6, 0.4, 0.7],
    sampleCall: {
      caller: "+1 (555) 234-8901",
      duration: "00:42",
      status: "Confirmed & Synced",
    },
  },
  {
    id: "support",
    icon: Headphones,
    label: "Customer Support",
    tag: "Instant Resolution",
    headline: "Resolves 89% of tier-1 support queries in seconds.",
    description: "Answers complex queries using your vector knowledge base. Performs account updates, checks order status, and safely escalates edge cases to your team with full transcripts.",
    objective: "Eliminate call hold times and support ticket backlogs",
    steps: [
      "Caller intent classified under 200ms",
      "Knowledge base vector search executed",
      "Accurate solution delivered in natural voice",
      "Auto-logged into Zendesk / HubSpot",
    ],
    metric: { label: "First-Call Resolution", value: "89%", change: "<300ms reply speed" },
    tint: "#6366f1",
    viz: "equalizer" as CaseVizKind,
    audioWave: [0.5, 0.3, 0.8, 0.6, 1, 0.7, 0.45, 0.9, 0.6, 0.75, 0.8, 0.5, 0.65, 0.4],
    sampleCall: {
      caller: "+1 (555) 890-1234",
      duration: "01:05",
      status: "Resolved & Logged",
    },
  },
  {
    id: "leads",
    icon: TrendingUp,
    label: "Lead Qualification",
    tag: "Inbound Pipeline",
    headline: "Qualifies & routes high-intent buyers instantly.",
    description: "Asks structured discovery questions, verifies budget and timeline, scores the lead, and live-transfers hot buyers directly to your closers before they shop elsewhere.",
    objective: "Maximize inbound lead conversion and pipeline velocity",
    steps: [
      "Inbound call answered on the first ring",
      "Natural discovery questions asked",
      "Lead qualified and BANT score computed",
      "Warm transfer to sales rep executed",
    ],
    metric: { label: "Qualified Lead Lift", value: "3.2×", change: "Zero dropped leads" },
    tint: "#0ea5e9",
    viz: "trend" as CaseVizKind,
    audioWave: [0.4, 0.65, 0.85, 0.5, 0.95, 0.7, 0.6, 0.8, 0.4, 0.9, 0.75, 0.5, 0.8, 0.6],
    sampleCall: {
      caller: "+1 (555) 456-7890",
      duration: "01:18",
      status: "Qualified & Transferred",
    },
  },
  {
    id: "followup",
    icon: PhoneOutgoing,
    label: "Follow-up Calls",
    tag: "Outbound Engagement",
    headline: "Re-engages cold leads & confirms upcoming visits.",
    description: "Launches targeted outbound campaigns to follow up on web form fills, confirm upcoming visits, conduct post-service check-ins, or re-engage dormant database contacts.",
    objective: "Reactivate quiet leads without adding sales headcount",
    steps: [
      "Target list uploaded or API triggered",
      "Outbound calls placed at high concurrency",
      "Two-way human conversation conducted",
      "Hot responses flagged for sales team",
    ],
    metric: { label: "Re-engagement Rate", value: "43%", change: "10x outbound speed" },
    tint: "#8b5cf6",
    viz: "ping" as CaseVizKind,
    audioWave: [0.6, 0.4, 0.75, 0.9, 0.5, 0.85, 0.65, 0.4, 0.95, 0.7, 0.5, 0.8, 0.6, 0.4],
    sampleCall: {
      caller: "+1 (555) 678-9012",
      duration: "00:54",
      status: "Re-engaged & Scheduled",
    },
  },
  {
    id: "updates",
    icon: Package,
    label: "Order Updates",
    tag: "Logistics & Delivery",
    headline: "Proactive delivery updates that eliminate WISMO calls.",
    description: "Automatically notifies buyers about dispatch, shipping delays, or delivery windows. Answers immediate questions like address changes or delivery instructions mid-call.",
    objective: "Slash 'where is my order?' support overhead by up to 60%",
    steps: [
      "Order status trigger from Shopify / ERP",
      "Automated phone call placed to customer",
      "Delivery window confirmed & questions answered",
      "Customer preference updated in system",
    ],
    metric: { label: "Inbound Call Reduction", value: "60%", change: "100% notification rate" },
    tint: "#ec4899",
    viz: "stream" as CaseVizKind,
    audioWave: [0.3, 0.7, 0.5, 0.85, 0.6, 0.9, 0.4, 0.75, 0.8, 0.5, 0.9, 0.6, 0.45, 0.7],
    sampleCall: {
      caller: "+1 (555) 345-6789",
      duration: "00:38",
      status: "Confirmed & Notified",
    },
  },
  {
    id: "afterhours",
    icon: Moon,
    label: "After-Hours",
    tag: "24/7/365 Coverage",
    headline: "Capture 100% of calls while your competitors sleep.",
    description: "Never let callers hit a dead voicemail. Vozpar answers night and weekend calls, books morning appointments, answers emergency queries, or alerts on-call managers.",
    objective: "Turn off-hours voicemail drops into instant booked revenue",
    steps: [
      "Call answered instantly at 2:00 AM",
      "Full interactive conversation handled",
      "Appointment booked or emergency routed",
      "Morning summary emailed to owner",
    ],
    metric: { label: "After-Hours Capture", value: "100%", change: "Zero voicemail losses" },
    tint: "#10b981",
    viz: "radar" as CaseVizKind,
    audioWave: [0.5, 0.8, 0.4, 0.9, 0.6, 0.75, 0.5, 0.85, 0.95, 0.4, 0.7, 0.6, 0.85, 0.5],
    sampleCall: {
      caller: "+1 (555) 901-2345",
      duration: "01:12",
      status: "Captured at 2:14 AM",
    },
  },
] as const

type CaseId = (typeof CASES)[number]["id"]

// Distinct micro-motion per tab icon when active — a shared generic pulse made every
// tab feel identical, so each one now animates in a way that hints at its own content.
const TAB_ICON_MOTION: Record<CaseId, { rotate?: number[]; scale?: number[]; y?: number[]; opacity?: number[] }> = {
  booking: { rotate: [0, -12, 0, 12, 0] },
  support: { scale: [1, 1.2, 1] },
  leads: { y: [0, -3, 0, -3, 0] },
  followup: { rotate: [0, -16, 16, -8, 0] },
  updates: { y: [0, -3, 1, 0] },
  afterhours: { scale: [1, 1.12, 1], opacity: [1, 0.7, 1] },
}

const CASE_INTERVAL = 5000

export function UseCases() {
  const [active, setActive] = useState<CaseId>("booking")
  const [isPaused, setIsPaused] = useState(false)
  const [waveOffset, setWaveOffset] = useState(0)
  const [isWaveHovered, setIsWaveHovered] = useState(false)
  const reduced = useReducedMotion()
  const cur = CASES.find(c => c.id === active)!

  // Keeps the waveform pattern continuously flowing, independent of which case is active.
  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setWaveOffset(o => o + 1), isWaveHovered ? 700 : 1400)
    return () => clearInterval(t)
  }, [reduced, isWaveHovered])

  const wave = cur.audioWave
  const rotatedWave = wave.map((_, i) => wave[(i + waveOffset) % wave.length])

  // Auto-advance through the use cases; resets on manual selection, pauses on hover.
  useEffect(() => {
    if (reduced || isPaused) return
    const t = setInterval(() => {
      setActive(id => {
        const i = CASES.findIndex(c => c.id === id)
        return CASES[(i + 1) % CASES.length].id
      })
    }, CASE_INTERVAL)
    return () => clearInterval(t)
  }, [reduced, isPaused, active])

  return (
    <section id="use-cases" className="relative overflow-hidden border-t border-white/[0.06] bg-black">
      {/* Dynamic background glow based on active tint */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] transition-all duration-700 opacity-20"
        style={{
          background: `radial-gradient(60% 50% at 50% 0%, ${cur.tint} 0%, transparent 80%)`,
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-14 lg:py-16">
        {/* Header */}
        <ScrollReveal className="mx-auto mb-7 max-w-3xl text-center lg:mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#046bd2]/30 bg-[#046bd2]/[0.08] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2d98f1]">
            <Sparkles className="h-3 w-3 text-[#2d98f1]" />
            Versatile Voice Platform
          </div>
          <h2 className="font-heading text-2xl font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-3xl md:text-4xl lg:text-5xl">
            One Platform,{" "}
            <span className="bg-gradient-to-r from-[#2d98f1] via-[#60b8ff] to-white bg-clip-text text-transparent">
              Every Call Scenario
            </span>
          </h2>
          <p className="mt-3 text-sm text-white/45 sm:text-base">
            Whether inbound support or outbound campaigns, Vozpar adapts to your business workflow in real-time.
          </p>
        </ScrollReveal>

        {/* Tab Navigation Pill Bar */}
        <div
          className="mb-5 flex flex-wrap justify-center gap-1.5 lg:mb-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {CASES.map(c => {
            const Icon = c.icon
            const isActive = c.id === active
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                onMouseEnter={() => setActive(c.id)}
                aria-pressed={isActive}
                className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-all duration-300 focus:outline-none ${
                  isActive ? "text-white shadow-lg" : "text-white/40 hover:text-white/70"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 rounded-full border"
                    style={{
                      borderColor: `${c.tint}60`,
                      background: `linear-gradient(135deg, ${c.tint}25 0%, ${c.tint}10 100%)`,
                      boxShadow: `0 0 20px ${c.tint}30`,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <motion.span
                  className="relative z-10 inline-flex shrink-0"
                  animate={isActive && !reduced ? TAB_ICON_MOTION[c.id] : undefined}
                  transition={{ duration: 1.4, repeat: isActive && !reduced ? Infinity : 0, repeatDelay: 0.6, ease: "easeInOut" }}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{ color: isActive ? c.tint : "currentColor" }}
                  />
                </motion.span>
                <span className="relative z-10">{c.label}</span>
              </button>
            )
          })}
        </div>

        {/* Main Showcase Panel */}
        <div
          className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#000000] shadow-2xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Top colored accent line */}
          <motion.div
            className="h-[2px] w-full"
            animate={{ background: `linear-gradient(90deg, transparent, ${cur.tint}, transparent)` }}
            transition={{ duration: 0.5 }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-6 p-5 sm:p-6 lg:grid-cols-12 lg:items-center lg:min-h-[340px]"
            >
              {/* Left Column: Details & Objective */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
                      style={{
                        borderColor: `${cur.tint}40`,
                        color: cur.tint,
                        background: `${cur.tint}12`,
                      }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: cur.tint }} />
                      {cur.tag}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
                      Automated Pipeline
                    </span>
                  </div>

                  <h3 className="mt-3 font-heading text-xl font-semibold leading-tight text-white sm:text-2xl md:text-3xl">
                    {cur.headline}
                  </h3>

                  <p className="mt-2.5 text-[13px] leading-relaxed text-white/50 sm:text-sm">
                    {cur.description}
                  </p>

                  <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold"
                      style={{ borderColor: `${cur.tint}40`, background: `${cur.tint}18`, color: cur.tint }}
                    >
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
                        Primary Business Goal
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-white/80">
                        {cur.objective}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Workflow Checklist */}
                <div className="mt-4">
                  <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                    Execution Workflow
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {cur.steps.map((step, i) => (
                      <motion.div
                        key={step}
                        initial={reduced ? undefined : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.08 }}
                        className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-black/40 px-3 py-2 text-xs text-white/70"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: cur.tint }} />
                        <span className="truncate">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Call Audio Simulator Box */}
              <div className="lg:col-span-5">
                <div
                  className="relative overflow-hidden rounded-2xl border p-5"
                  style={{
                    background: "linear-gradient(145deg, #0a0a0a 0%, #000000 100%)",
                    borderColor: `${cur.tint}35`,
                    boxShadow: `0 20px 50px -10px ${cur.tint}20`,
                  }}
                >
                  {/* Top Live Call Header */}
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="relative flex h-8 w-8 items-center justify-center rounded-full border"
                        style={{ borderColor: `${cur.tint}40`, background: `${cur.tint}15` }}
                      >
                        <PhoneCall className="h-3.5 w-3.5" style={{ color: cur.tint }} />
                        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        </span>
                      </div>
                      <div>
                        <p className="font-mono text-xs font-semibold text-white">
                          {cur.sampleCall.caller}
                        </p>
                        <p className="font-mono text-[9px] text-emerald-400">
                          {cur.sampleCall.status}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-white/40">
                      {cur.sampleCall.duration}
                    </span>
                  </div>

                  {/* Per-case visualisation — each of the six tabs renders a
                      genuinely different shape (see use-case-visuals.tsx):
                      calendar grid, segmented equalizer, trend line, outbound
                      ping rings, packet stream, radar sweep. Switching tabs
                      used to just recolour the same plot; now the shape
                      itself changes with the content. */}
                  <div
                    className="mt-4 flex flex-col items-center justify-center gap-2.5 rounded-xl border border-white/[0.06] bg-black/50 p-4 transition-all duration-300 hover:scale-[1.02]"
                    onMouseEnter={() => setIsWaveHovered(true)}
                    onMouseLeave={() => setIsWaveHovered(false)}
                    style={{
                      borderColor: isWaveHovered ? `${cur.tint}55` : undefined,
                      boxShadow: isWaveHovered ? `0 0 28px -8px ${cur.tint}55` : undefined,
                    }}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                      {CASE_VIZ_LABEL[cur.viz]}
                    </span>
                    <CaseViz kind={cur.viz} tint={cur.tint} wave={rotatedWave} reduced={Boolean(reduced)} />
                    <span className="font-mono text-[10px]" style={{ color: cur.tint }}>
                      Voice Latency: &lt;280ms
                    </span>
                  </div>

                  {/* Metric Result Box */}
                  <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                          {cur.metric.label}
                        </p>
                        <p className="mt-1 font-heading text-2xl font-bold" style={{ color: cur.tint }}>
                          {cur.metric.value}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-mono text-emerald-400">
                        <ArrowUpRight className="h-3 w-3" />
                        {cur.metric.change}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
