"use client"

import { useState } from "react"
import {
  Layers, Plug, Globe2, ShieldCheck, Database, Calendar, Phone,
  FileText, Server, Lock, CheckCircle2, ArrowRight, Zap, Cpu, Sparkles
} from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

const ARCHITECTURE_TABS = [
  {
    id: "integrations",
    icon: Plug,
    tag: "Real-time Execution",
    title: "Acts During the Call, Not After",
    subtitle: "Vozpar queries your systems live mid-conversation — providing real answers, booking slots, and updating CRM records before the call hangs up.",
    tint: "#2d98f1",
    highlights: [
      "Queries calendar availability in real time",
      "Reads & updates CRM records mid-call",
      "Retrieves verified answers from your vector DB",
      "Sends instant SMS & WhatsApp confirmations",
    ],
    widget: "network",
  },
  {
    id: "carrier",
    icon: Globe2,
    tag: "Carrier Independence",
    title: "Your Number Stays Exactly Where It Is",
    subtitle: "No porting, no selling new numbers, no downtime. Connect your existing Twilio, Telnyx, or SIP trunk to route inbound and outbound audio seamlessly.",
    tint: "#6366f1",
    highlights: [
      "Zero phone number porting or migration",
      "Sub-300ms global carrier-grade audio pipeline",
      "Works with Twilio, Plivo, Telnyx, or custom SIP",
      "99.99% uptime SLA with automatic failover",
    ],
    widget: "telephony",
  },
  {
    id: "security",
    icon: ShieldCheck,
    tag: "100% Data Sovereignty",
    title: "Your Infrastructure. Your Rules.",
    subtitle: "Deploy on AWS, GCP, Azure, or private on-premise servers. Call recordings, transcripts, and customer data never leave your secure network perimeter.",
    tint: "#10b981",
    highlights: [
      "Deploy on Docker, Kubernetes, or Bare Metal",
      "Zero third-party data retention or model training",
      "SOC2, HIPAA & GDPR compliance ready",
      "End-to-end encrypted audio stream processing",
    ],
    widget: "security",
  },
] as const

type TabId = (typeof ARCHITECTURE_TABS)[number]["id"]

// ── Interactive Widget 1: Integration Network ──
function NetworkWidget({ tint, reduced }: { tint: string; reduced: boolean }) {
  const nodes = [
    { label: "Google Calendar", icon: Calendar, color: "#2d98f1" },
    { label: "HubSpot / Salesforce", icon: Database, color: "#6366f1" },
    { label: "Twilio / Telnyx SIP", icon: Phone, color: "#0ea5e9" },
    { label: "Knowledge Base", icon: FileText, color: "#10b981" },
  ]

  return (
    <div className="relative flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 font-mono text-[10px] text-white/50">
        <Cpu className="h-3 w-3 text-[#2d98f1]" />
        Live Voice Engine Hub
      </div>

      {/* Central Core */}
      <motion.div
        className="relative flex h-20 w-20 items-center justify-center rounded-2xl border"
        style={{
          borderColor: `${tint}60`,
          background: `linear-gradient(135deg, ${tint}25 0%, #060812 100%)`,
          boxShadow: `0 0 35px ${tint}35`,
        }}
        animate={reduced ? undefined : { scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-heading text-xs font-bold tracking-widest text-white">
          VOZPAR
        </span>
        <span className="absolute -bottom-2 rounded-full bg-emerald-500 px-2 py-0.5 font-mono text-[8px] font-bold uppercase text-black">
          Connected
        </span>
      </motion.div>

      {/* Grid of connected systems */}
      <div className="mt-8 grid grid-cols-2 gap-3 w-full">
        {nodes.map((n, i) => {
          const Icon = n.icon
          return (
            <motion.div
              key={n.label}
              initial={reduced ? undefined : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-black/40 p-3 text-left"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                style={{ borderColor: `${n.color}35`, background: `${n.color}15`, color: n.color }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-mono text-[10px] font-semibold text-white/80 truncate">
                  {n.label}
                </p>
                <p className="font-mono text-[8px] text-emerald-400">
                  Real-time Sync
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ── Interactive Widget 2: Carrier Telephony ──
function TelephonyWidget({ tint, reduced }: { tint: string; reduced: boolean }) {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2 font-mono text-xs text-white">
          <Globe2 className="h-4 w-4 text-[#6366f1]" />
          Carrier Network Routing
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[9px] text-emerald-400">
          99.99% SLA
        </span>
      </div>

      {/* Latency meter */}
      <div className="rounded-xl border border-white/[0.08] bg-black/50 p-4">
        <div className="flex items-center justify-between font-mono text-[10px]">
          <span className="text-white/40">SIP Latency Benchmark</span>
          <span style={{ color: tint }}>240ms (Sub-300ms SLA)</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${tint}, #10b981)` }}
            initial={{ width: "0%" }}
            animate={{ width: "82%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Live Carrier Nodes */}
      <div className="space-y-2">
        {[
          { provider: "Twilio SIP Trunk", status: "Active · 12ms", flag: "🇺🇸" },
          { provider: "Telnyx Global Direct", status: "Active · 18ms", flag: "🇪🇺" },
          { provider: "Custom PBX / Asterisk", status: "Connected", flag: "🌐" },
        ].map((item, i) => (
          <div
            key={item.provider}
            className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/40 px-3.5 py-2.5 text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span>{item.flag}</span>
              <span className="font-mono font-medium text-white/80">{item.provider}</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Interactive Widget 3: Security Boundary ──
function SecurityWidget({ tint, reduced }: { tint: string; reduced: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      {/* Perimeter Box */}
      <div className="relative w-full rounded-2xl border border-dashed border-emerald-500/40 bg-black/60 p-5">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-emerald-500/40 bg-[#07080d] px-3 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-400">
          Private Infrastructure Boundary
        </div>

        <div className="mt-3 grid gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-left">
            <Server className="h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="font-mono text-xs font-semibold text-white">Your Cloud / On-Prem VPC</p>
              <p className="font-mono text-[9px] text-white/40">AWS, GCP, Azure, or Private Server</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-left">
            <Lock className="h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="font-mono text-xs font-semibold text-white">Vozpar Self-Hosted Engine</p>
              <p className="font-mono text-[9px] text-white/40">Zero data leaves your perimeter</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-left">
            <Database className="h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="font-mono text-xs font-semibold text-white">Encrypted Storage & Logs</p>
              <p className="font-mono text-[9px] text-white/40">SOC2 · HIPAA · GDPR Compliant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PlatformCore() {
  const reduced = useReducedMotion()
  const [activeTab, setActiveTab] = useState<TabId>("integrations")

  const current = ARCHITECTURE_TABS.find(t => t.id === activeTab)!

  return (
    <section id="platform-core" className="relative overflow-hidden border-t border-white/[0.06] bg-black">
      {/* Background radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[500px]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 0%, rgba(4,107,210,0.1) 0%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:py-32">
        {/* Header */}
        <ScrollReveal className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#046bd2]/30 bg-[#046bd2]/[0.08] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2d98f1]">
            <Sparkles className="h-3 w-3 text-[#2d98f1]" />
            Enterprise Infrastructure
          </div>
          <h2 className="font-heading text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Built for Zero Downtime &{" "}
            <span className="bg-gradient-to-r from-[#2d98f1] via-[#60b8ff] to-[#10b981] bg-clip-text text-transparent">
              Total Data Privacy
            </span>
          </h2>
          <p className="mt-4 text-base text-white/45 sm:text-lg">
            Everything you need in one architecture — real-time tool execution, carrier independence, and 100% self-hosted data ownership.
          </p>
        </ScrollReveal>

        {/* Tab Switcher Pills */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {ARCHITECTURE_TABS.map(tab => {
            const Icon = tab.icon
            const isSelected = tab.id === activeTab
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2.5 rounded-full px-5 py-3 text-xs sm:text-sm font-medium transition-all duration-300 focus:outline-none ${
                  isSelected ? "text-white shadow-xl" : "text-white/40 hover:text-white/70"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="platformCoreTab"
                    className="absolute inset-0 rounded-full border"
                    style={{
                      borderColor: `${tab.tint}60`,
                      background: `linear-gradient(135deg, ${tab.tint}22 0%, ${tab.tint}08 100%)`,
                      boxShadow: `0 0 25px ${tab.tint}30`,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon
                  className="relative z-10 h-4 w-4"
                  style={{ color: isSelected ? tab.tint : "currentColor" }}
                />
                <span className="relative z-10">{tab.tag}</span>
              </button>
            )
          })}
        </div>

        {/* Main 2-Column Content Showcase */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#07080d] shadow-2xl">
          <motion.div
            className="h-[2px] w-full"
            animate={{ background: `linear-gradient(90deg, transparent, ${current.tint}, transparent)` }}
            transition={{ duration: 0.5 }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-10 p-6 sm:p-8 md:p-10 lg:grid-cols-12 lg:items-center"
            >
              {/* Left Column: Description & Feature Points */}
              <div className="lg:col-span-7">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{
                    borderColor: `${current.tint}40`,
                    color: current.tint,
                    background: `${current.tint}12`,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: current.tint }} />
                  {current.tag}
                </span>

                <h3 className="mt-4 font-heading text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
                  {current.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-white/50 sm:text-base">
                  {current.subtitle}
                </p>

                {/* Checklist points */}
                <div className="mt-8 space-y-3">
                  {current.highlights.map((h, i) => (
                    <motion.div
                      key={h}
                      initial={reduced ? undefined : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                      className="flex items-center gap-3 text-xs sm:text-sm text-white/75"
                    >
                      <div
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
                        style={{
                          borderColor: `${current.tint}40`,
                          background: `${current.tint}15`,
                          color: current.tint,
                        }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <span>{h}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.08]">
                  <a
                    href="/get-started"
                    className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#2d98f1] hover:underline"
                  >
                    Explore full architecture docs
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Right Column: Interactive Graphic Widget */}
              <div className="lg:col-span-5">
                <div
                  className="relative overflow-hidden rounded-2xl border"
                  style={{
                    background: "linear-gradient(145deg, #0a0d18 0%, #05070e 100%)",
                    borderColor: `${current.tint}35`,
                    boxShadow: `0 20px 50px -10px ${current.tint}20`,
                  }}
                >
                  {current.widget === "network" && (
                    <NetworkWidget tint={current.tint} reduced={Boolean(reduced)} />
                  )}
                  {current.widget === "telephony" && (
                    <TelephonyWidget tint={current.tint} reduced={Boolean(reduced)} />
                  )}
                  {current.widget === "security" && (
                    <SecurityWidget tint={current.tint} reduced={Boolean(reduced)} />
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
