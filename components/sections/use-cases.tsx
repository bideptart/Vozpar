"use client"

import { useState } from "react"
import {
  Calendar, Headphones, TrendingUp, PhoneOutgoing, Package, Moon,
  CheckCircle2, ArrowUpRight, Sparkles, Activity, ShieldCheck, PhoneCall, Zap, Play
} from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

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
    audioWave: [0.5, 0.8, 0.4, 0.9, 0.6, 0.75, 0.5, 0.85, 0.95, 0.4, 0.7, 0.6, 0.85, 0.5],
    sampleCall: {
      caller: "+1 (555) 901-2345",
      duration: "01:12",
      status: "Captured at 2:14 AM",
    },
  },
] as const

type CaseId = (typeof CASES)[number]["id"]

export function UseCases() {
  const [active, setActive] = useState<CaseId>("booking")
  const reduced = useReducedMotion()
  const cur = CASES.find(c => c.id === active)!

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

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:py-32">
        {/* Header */}
        <ScrollReveal className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#046bd2]/30 bg-[#046bd2]/[0.08] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2d98f1]">
            <Sparkles className="h-3 w-3 text-[#2d98f1]" />
            Versatile Voice Platform
          </div>
          <h2 className="font-heading text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
            One Platform,{" "}
            <span className="bg-gradient-to-r from-[#2d98f1] via-[#60b8ff] to-white bg-clip-text text-transparent">
              Every Call Scenario
            </span>
          </h2>
          <p className="mt-4 text-base text-white/45 sm:text-lg">
            Whether inbound support or outbound campaigns, Vozpar adapts to your business workflow in real-time.
          </p>
        </ScrollReveal>

        {/* Tab Navigation Pill Bar */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {CASES.map(c => {
            const Icon = c.icon
            const isActive = c.id === active
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                aria-pressed={isActive}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 focus:outline-none ${
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
                <Icon
                  className="relative z-10 h-4 w-4 shrink-0 transition-transform duration-300"
                  style={{ color: isActive ? c.tint : "currentColor" }}
                />
                <span className="relative z-10">{c.label}</span>
              </button>
            )
          })}
        </div>

        {/* Main Showcase Panel */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#07080d] shadow-2xl">
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
              className="grid gap-10 p-6 sm:p-8 md:p-10 lg:grid-cols-12 lg:items-center"
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

                  <h3 className="mt-5 font-heading text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
                    {cur.headline}
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-white/50 sm:text-base">
                    {cur.description}
                  </p>

                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
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
                      <p className="mt-0.5 text-xs sm:text-sm font-medium text-white/80">
                        {cur.objective}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Workflow Checklist */}
                <div className="mt-8">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                    Execution Workflow
                  </p>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {cur.steps.map((step, i) => (
                      <motion.div
                        key={step}
                        initial={reduced ? undefined : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.08 }}
                        className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-black/40 px-3.5 py-2.5 text-xs text-white/70"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: cur.tint }} />
                        <span className="truncate">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Call Audio Simulator Box */}
              <div className="lg:col-span-5">
                <div
                  className="relative overflow-hidden rounded-2xl border p-6"
                  style={{
                    background: "linear-gradient(145deg, #0c0f1c 0%, #060810 100%)",
                    borderColor: `${cur.tint}35`,
                    boxShadow: `0 20px 50px -10px ${cur.tint}20`,
                  }}
                >
                  {/* Top Live Call Header */}
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="relative flex h-9 w-9 items-center justify-center rounded-full border"
                        style={{ borderColor: `${cur.tint}40`, background: `${cur.tint}15` }}
                      >
                        <PhoneCall className="h-4 w-4" style={{ color: cur.tint }} />
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

                  {/* Waveform Visualizer */}
                  <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border border-white/[0.06] bg-black/50 p-5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                      Audio Processing Engine
                    </span>
                    <div className="flex h-12 items-center gap-[4px]">
                      {cur.audioWave.map((h, i) => (
                        <motion.span
                          key={i}
                          className="block w-[3px] rounded-full"
                          style={{ background: cur.tint }}
                          animate={
                            reduced
                              ? { height: h * 24, opacity: 0.5 }
                              : {
                                  height: [h * 8, h * 36, h * 12, h * 30, h * 8],
                                  opacity: [0.5, 1, 0.6, 0.9, 0.5],
                                }
                          }
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.07,
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[10px]" style={{ color: cur.tint }}>
                      Voice Latency: &lt;280ms
                    </span>
                  </div>

                  {/* Metric Result Box */}
                  <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                          {cur.metric.label}
                        </p>
                        <p className="mt-1 font-heading text-3xl font-bold" style={{ color: cur.tint }}>
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
