"use client"

import { useState } from "react"
import { Calendar, Headphones, TrendingUp, PhoneOutgoing, Package, Moon } from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

const CASES = [
  {
    id: "booking", icon: Calendar, label: "Appointment Booking",
    headline: "Books every available slot, automatically.",
    description: "Callers state what they need. The agent checks your calendar, offers slots, confirms the booking, and sends an SMS — no staff required.",
    objective: "Fill every available slot without manual effort",
    steps: ["Caller states availability preference", "Agent queries calendar in real time", "Slot confirmed and SMS sent", "CRM record updated instantly"],
    metric: { label: "Booking rate", value: "94%", color: "#10b981" },
    tint: "#2d98f1",
  },
  {
    id: "support", icon: Headphones, label: "Customer Support",
    headline: "Resolves, not just responds.",
    description: "Answers from your knowledge base, handles account queries, processes simple requests, and escalates only what truly needs a human.",
    objective: "Resolve tier-1 issues without a support queue",
    steps: ["Intent classified under 1 second", "Knowledge base searched instantly", "Answer or action delivered", "Escalation only when needed"],
    metric: { label: "First-call resolution", value: "87%", color: "#10b981" },
    tint: "#046bd2",
  },
  {
    id: "leads", icon: TrendingUp, label: "Lead Qualification",
    headline: "Qualifies before it transfers.",
    description: "Asks the right discovery questions, scores the lead, and routes hot prospects to a human rep — all before they wait on hold.",
    objective: "Surface sales-ready leads faster",
    steps: ["Inbound call answered instantly", "Discovery questions asked naturally", "Lead scored and tagged", "Hot leads routed immediately"],
    metric: { label: "Qualified-lead lift", value: "3×", color: "#2d98f1" },
    tint: "#2d98f1",
  },
  {
    id: "followup", icon: PhoneOutgoing, label: "Follow-up Calls",
    headline: "Follows up at scale.",
    description: "Launch outbound campaigns to re-engage dormant leads, confirm upcoming appointments, or deliver proactive updates automatically.",
    objective: "Re-engage leads you'd otherwise lose",
    steps: ["Campaign defined in dashboard", "Calls placed automatically", "Responses captured and stored", "Hot responses flagged for team"],
    metric: { label: "Re-engagement rate", value: "41%", color: "#2d98f1" },
    tint: "#046bd2",
  },
  {
    id: "updates", icon: Package, label: "Order Updates",
    headline: "Proactive, not reactive.",
    description: "Notify customers about orders, deliveries, or service changes with an outbound call that answers follow-up questions on the spot.",
    objective: "Cut inbound 'where is my order?' volume",
    steps: ["Trigger from your system", "Personalised call placed", "Customer questions handled", "Update logged in CRM"],
    metric: { label: "Inbound reduction", value: "55%", color: "#10b981" },
    tint: "#2d98f1",
  },
  {
    id: "afterhours", icon: Moon, label: "After-Hours",
    headline: "Never miss a call.",
    description: "Every caller is greeted, helped where possible, and either scheduled for a callback or connected to an emergency line — at any hour.",
    objective: "Zero missed opportunities after close",
    steps: ["Call answered at any hour", "FAQ and booking handled live", "Urgent calls escalated", "Others scheduled for callback"],
    metric: { label: "After-hours capture", value: "100%", color: "#10b981" },
    tint: "#046bd2",
  },
] as const

type CaseId = (typeof CASES)[number]["id"]

export function UseCases() {
  const [active, setActive] = useState<CaseId>("booking")
  const reduced = useReducedMotion()
  const cur = CASES.find(c => c.id === active)!

  return (
    <section id="use-cases" className="relative overflow-hidden border-t border-white/[0.06]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[400px]"
        style={{ background: "radial-gradient(50% 50% at 50% 0%, rgba(4,107,210,0.06), transparent 70%)" }} />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-28">

        <ScrollReveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-[#2d98f1]">Use cases</p>
          <h2 className="font-heading text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl">
            One platform,{" "}
            <span className="text-white/55">every call scenario.</span>
          </h2>
        </ScrollReveal>

        {/* Tab bar */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {CASES.map(c => {
            const Icon = c.icon
            const isActive = c.id === active
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                aria-pressed={isActive}
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]"
                style={{
                  borderColor: isActive ? `${c.tint}45` : "rgba(255,255,255,0.07)",
                  background: isActive ? `${c.tint}12` : "transparent",
                  color: isActive ? c.tint : "rgba(255,255,255,0.4)",
                }}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {c.label}
              </button>
            )
          })}
        </div>

        {/* Content panel */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08090e]">
          <div className="h-px w-full"
            style={{ background: `linear-gradient(to right, transparent, ${cur.tint}55, transparent)` }} />

          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduced ? 0 : 0.28 }}
              className="grid gap-8 p-7 md:p-10 lg:grid-cols-5"
            >
              {/* Left */}
              <div className="lg:col-span-3">
                <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]"
                  style={{ borderColor: `${cur.tint}28`, color: cur.tint, background: `${cur.tint}0a` }}>
                  {cur.label}
                </span>
                <h3 className="mt-4 font-heading text-2xl font-medium leading-snug tracking-tight text-white md:text-3xl">
                  {cur.headline}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-white/45">{cur.description}</p>
                <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm">
                  <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-white/30 mt-0.5">Goal</span>
                  <span className="text-white/60">{cur.objective}</span>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col gap-4 lg:col-span-2">
                {/* Steps */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4">
                  <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">Workflow</p>
                  <ol className="space-y-2.5">
                    {cur.steps.map((step, i) => (
                      <motion.li key={step}
                        initial={reduced ? undefined : { opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.06 }}
                        className="flex items-start gap-2.5 text-sm text-white/50"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[9px] font-bold"
                          style={{ background: `${cur.tint}16`, color: cur.tint }}>
                          {i + 1}
                        </span>
                        {step}
                      </motion.li>
                    ))}
                  </ol>
                </div>

                {/* Outcome */}
                <div className="flex items-center justify-between rounded-xl border px-5 py-4"
                  style={{ borderColor: `${cur.metric.color}20`, background: `${cur.metric.color}07` }}>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em]"
                      style={{ color: `${cur.metric.color}70` }}>
                      {cur.metric.label}
                    </p>
                    <p className="mt-0.5 font-heading text-3xl font-medium"
                      style={{ color: cur.metric.color }}>
                      {cur.metric.value}
                    </p>
                  </div>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                      style={{ background: cur.metric.color }} />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full"
                      style={{ background: cur.metric.color }} />
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
