"use client"

import { useEffect, useState } from "react"
import {
  Plug, Globe2, ShieldCheck, CheckCircle2, ArrowRight, Cpu, Sparkles,
  Calendar, Database, FileText, PhoneCall, Radio, Waypoints, Server, Lock, KeyRound,
} from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { ArchitectureViz, type ArchKind } from "@/components/sections/platform-core-visuals"

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
    nodes: [
      { label: "Calendar", icon: Calendar },
      { label: "CRM", icon: Database },
      { label: "Vector DB", icon: FileText },
    ],
    viz: "hub" as ArchKind,
    metrics: [
      { label: "Sync latency", value: "<200ms" },
      { label: "Systems linked", value: "4 active" },
    ],
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
    nodes: [
      { label: "Twilio", icon: PhoneCall },
      { label: "Telnyx", icon: Radio },
      { label: "SIP Trunk", icon: Waypoints },
    ],
    viz: "relay" as ArchKind,
    metrics: [
      { label: "Audio latency", value: "<300ms" },
      { label: "Uptime SLA", value: "99.99%" },
    ],
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
    nodes: [
      { label: "Your VPC", icon: Server },
      { label: "Encrypted Store", icon: Lock },
      { label: "Access Control", icon: KeyRound },
    ],
    viz: "vault" as ArchKind,
    metrics: [
      { label: "External data", value: "0 bytes" },
      { label: "Compliance", value: "SOC2 · HIPAA" },
    ],
  },
] as const

type TabId = (typeof ARCHITECTURE_TABS)[number]["id"]

const TAB_INTERVAL = 5000

export function PlatformCore() {
  const reduced = useReducedMotion()
  const [activeTab, setActiveTab] = useState<TabId>("integrations")
  const [isPaused, setIsPaused] = useState(false)

  const current = ARCHITECTURE_TABS.find(t => t.id === activeTab)!

  // Auto-rotate through the tabs; pauses whenever a tab or the panel is hovered.
  useEffect(() => {
    if (reduced || isPaused) return
    const t = setInterval(() => {
      setActiveTab(id => {
        const i = ARCHITECTURE_TABS.findIndex(tab => tab.id === id)
        return ARCHITECTURE_TABS[(i + 1) % ARCHITECTURE_TABS.length].id
      })
    }, TAB_INTERVAL)
    return () => clearInterval(t)
  }, [reduced, isPaused])

  return (
    <section id="platform-core" className="relative overflow-hidden border-t border-white/[0.06] bg-black">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px]"
        style={{
          background: "radial-gradient(50% 50% at 50% 0%, rgba(4,107,210,0.1) 0%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14">
        {/* Header */}
        <ScrollReveal className="mx-auto mb-6 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#046bd2]/30 bg-[#046bd2]/[0.08] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2d98f1]">
            <Sparkles className="h-3 w-3 text-[#2d98f1]" />
            Enterprise Infrastructure
          </div>
          <h2 className="font-heading text-2xl font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl">
            Built for Zero Downtime &{" "}
            <span className="bg-gradient-to-r from-[#2d98f1] via-[#60b8ff] to-[#10b981] bg-clip-text text-transparent">
              Total Data Privacy
            </span>
          </h2>
          <p className="mt-2.5 text-sm text-white/45">
            Everything you need in one architecture — real-time tool execution, carrier independence, and 100% self-hosted data ownership.
          </p>
        </ScrollReveal>

        {/* Tab Switcher — below lg, full-width cards with a circular tinted
            icon badge and generous padding so nothing crowds the border
            (same treatment as the Use Cases tab bar). lg+ keeps the
            original compact centered pill row. */}
        <div
          className="mb-5 flex flex-col gap-2 sm:grid sm:grid-cols-3 lg:flex lg:flex-row lg:flex-wrap lg:justify-center lg:gap-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {ARCHITECTURE_TABS.map(tab => {
            const Icon = tab.icon
            const isSelected = tab.id === activeTab
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                onMouseEnter={() => setActiveTab(tab.id)}
                aria-pressed={isSelected}
                className={`relative flex min-w-0 items-center gap-3 rounded-2xl border px-3.5 py-3 text-left text-xs font-medium transition-all duration-300 focus:outline-none sm:text-[11px] lg:w-auto lg:rounded-full lg:border-0 lg:px-4 lg:py-2.5 lg:text-sm ${
                  isSelected
                    ? "border-white/[0.12] bg-white/[0.03] text-white shadow-lg"
                    : "border-white/[0.06] bg-white/[0.015] text-white/40 hover:border-white/[0.1] hover:text-white/70 lg:border-0 lg:bg-transparent"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="platformCoreTab"
                    className="absolute inset-0 rounded-2xl border lg:rounded-full"
                    style={{
                      borderColor: `${tab.tint}60`,
                      background: `linear-gradient(135deg, ${tab.tint}22 0%, ${tab.tint}08 100%)`,
                      boxShadow: `0 0 22px ${tab.tint}30`,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span
                  className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border lg:h-auto lg:w-auto lg:rounded-none lg:border-0 lg:bg-transparent"
                  style={{
                    borderColor: isSelected ? `${tab.tint}55` : "rgba(255,255,255,0.08)",
                    background: isSelected ? `${tab.tint}18` : "rgba(255,255,255,0.03)",
                  }}
                >
                  <Icon className="h-4 w-4" style={{ color: isSelected ? tab.tint : "currentColor" }} />
                </span>
                <span className="relative z-10 min-w-0 truncate leading-tight">{tab.tag}</span>
              </button>
            )
          })}
        </div>

        {/* Main 2-Column Content Showcase */}
        <div
          className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#000000] shadow-2xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="h-[2px] w-full"
            animate={{ background: `linear-gradient(90deg, transparent, ${current.tint}, transparent)` }}
            transition={{ duration: 0.5 }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-8 p-5 sm:p-6 md:p-7 lg:grid-cols-12 lg:items-center"
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

                <h3 className="mt-3 font-heading text-xl font-semibold leading-tight text-white sm:text-2xl md:text-3xl">
                  {current.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  {current.subtitle}
                </p>

                <div className="mt-5 space-y-2">
                  {current.highlights.map((h, i) => (
                    <motion.div
                      key={h}
                      initial={reduced ? undefined : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.07 }}
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

                <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4">
                  <a
                    href="/contact"
                    className="group inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#2d98f1] hover:underline"
                  >
                    Talk to our engineering team
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>

              {/* Right Column: Live Architecture Visualization */}
              <div className="lg:col-span-5">
                <div
                  className="relative overflow-hidden rounded-2xl border"
                  style={{
                    background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, #000000 60%)",
                    borderColor: `${current.tint}35`,
                    boxShadow: `0 20px 50px -12px ${current.tint}25`,
                  }}
                >
                  <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
                      <Cpu className="h-3 w-3 text-white/40" />
                      Live Architecture
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[9px] text-emerald-400">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      Operational
                    </span>
                  </div>

                  <ArchitectureViz
                    kind={current.viz}
                    icon={current.icon}
                    tint={current.tint}
                    nodes={current.nodes}
                    reduced={Boolean(reduced)}
                  />

                  <div className="grid grid-cols-2 divide-x divide-white/[0.06] border-t border-white/[0.08]">
                    {current.metrics.map(m => (
                      <div key={m.label} className="px-4 py-3">
                        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">{m.label}</p>
                        <p className="mt-0.5 font-mono text-sm font-semibold" style={{ color: current.tint }}>
                          {m.value}
                        </p>
                      </div>
                    ))}
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
