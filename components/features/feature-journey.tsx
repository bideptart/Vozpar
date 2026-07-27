"use client"

import { useEffect, useRef, useState } from "react"
import type { ElementType } from "react"
import {
  Users,
  AudioLines,
  SlidersHorizontal,
  BookOpen,
  Copy,
  GitBranch,
  FlaskConical,
  PhoneCall,
  LayoutTemplate,
  BarChart3,
  CalendarCheck,
  FileText,
  LifeBuoy,
  Settings,
  LayoutDashboard,
  Fingerprint,
  ChevronDown,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

type StageKey = "build-setup" | "train-configure" | "test-go-live" | "operate-monitor" | "account-overview"

type Item = { icon: ElementType; title: string; blurb: string; detail: string }

type Stage = {
  key: StageKey
  label: string
  description: string
  accent: string
  items: Item[]
}

const STAGES: Stage[] = [
  {
    key: "build-setup",
    label: "Build & Setup",
    description: "Spin up agents and give each one a voice and a personality.",
    accent: "#3b82f6", // 1. Blue
    items: [
      {
        icon: Users,
        title: "Multi-Agent Management",
        blurb: "Create and manage as many AI agents as you need from a single account.",
        detail: "One dashboard, one login, one bill — whether you're running one number or fifty.",
      },
      {
        icon: AudioLines,
        title: "Voice Selection",
        blurb: "Choose from ten named voices, each with a personality description and a preview clip.",
        detail: "Preview any voice against your own script before it ever answers a real call.",
      },
      {
        icon: SlidersHorizontal,
        title: "Call Behavior Controls",
        blurb: "Set how your agent greets callers, handles interruptions, and hands off conversations.",
        detail: "Greeting, tone, barge-in sensitivity, and handoff rules — tuned per agent, not global.",
      },
    ],
  },
  {
    key: "train-configure",
    label: "Train & Configure",
    description: "Teach each agent your business and route calls the way you want.",
    accent: "#10b981", // 2. Green
    items: [
      {
        icon: BookOpen,
        title: "Knowledge Base (per agent)",
        blurb: "Give each agent its own set of company facts, FAQs, and policies to draw on.",
        detail: "Paste in docs, pricing, or policies — the agent answers from your source of truth, not a guess.",
      },
      {
        icon: Copy,
        title: "Reusable Knowledge Templates",
        blurb: "Save a knowledge setup once and reuse it across multiple agents or numbers.",
        detail: "Clone a working setup to a new location instead of rebuilding it from scratch.",
      },
      {
        icon: GitBranch,
        title: "Behavior & Routing Rules",
        blurb: "Define escalation paths, working hours, and fallback numbers per agent.",
        detail: "After-hours routing, human escalation, and fallback numbers — set once, per agent.",
      },
    ],
  },
  {
    key: "test-go-live",
    label: "Test & Go Live",
    description: "Hear your agent before you ever risk a real caller on it.",
    accent: "#10b981", // 3. Green
    items: [
      {
        icon: FlaskConical,
        title: "Playground / Live Testing",
        blurb: "Test your agent before it ever answers a real caller.",
        detail: "Run through every branch of a script in a sandbox, with instant edits between takes.",
      },
      {
        icon: PhoneCall,
        title: "Live Test Call (dial-in)",
        blurb: "Dial your own number and hear exactly what a caller will.",
        detail: "The real telephony path, the real voice, the real latency — not a browser simulation.",
      },
      {
        icon: LayoutTemplate,
        title: "Ready-Made Setup Templates",
        blurb: "Start from an industry-tuned playbook instead of a blank agent.",
        detail: "Real estate, dental, home services and more ship with scripts and routing pre-built.",
      },
    ],
  },
  {
    key: "operate-monitor",
    label: "Operate & Monitor",
    description: "Watch every call, everything it agreed to, down to the exact word.",
    accent: "#ff7a00", // 4. Orange
    items: [
      {
        icon: BarChart3,
        title: "Analytics Dashboard",
        blurb: "Track volume, sentiment, call outcomes, and duration in one place.",
        detail: "The same numbers a call center manager watches, without the call center.",
      },
      {
        icon: CalendarCheck,
        title: "Booking History",
        blurb: "See every appointment your agent has booked, rescheduled, or cancelled.",
        detail: "A running ledger of every slot touched — no separate calendar to reconcile against.",
      },
      {
        icon: FileText,
        title: "Call Transcripts & Recordings",
        blurb: "Every call, searchable, with speaker labels and compliance-ready redaction.",
        detail: "Search a phrase across every call this month instead of listening back one at a time.",
      },
      {
        icon: LifeBuoy,
        title: "Support Ticket Explorer",
        blurb: "Read what your agent escalated and why, without listening to the call.",
        detail: "Every handoff to a human comes with the context — what was asked, and why it escalated.",
      },
    ],
  },
  {
    key: "account-overview",
    label: "Account & Overview",
    description: "Manage the account, your team, and your agents' identity.",
    accent: "#ef4444", // 5. Red
    items: [
      {
        icon: Settings,
        title: "Account Settings",
        blurb: "Manage billing, teammates, and access at a glance.",
        detail: "Seats, roles, and billing in one screen — no separate admin tool to log into.",
      },
      {
        icon: LayoutDashboard,
        title: "Dashboard Overview",
        blurb: "See how your agents are performing across every number you run.",
        detail: "One glance at every agent's health before you drill into any single one.",
      },
      {
        icon: Fingerprint,
        title: "Agent Identity Setup",
        blurb: "Name your agent, set its persona, and connect its number.",
        detail: "The last step before go-live: a name, a persona, and a phone number, tied together.",
      },
    ],
  },
]

export function FeatureJourney() {
  const [activeStage, setActiveStage] = useState<StageKey>("build-setup")
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const isManualScroll = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScroll.current) return

      const triggerPoint = window.innerHeight * 0.35

      for (let i = 0; i < STAGES.length; i++) {
        const stage = STAGES[i]
        const el = document.getElementById(stage.key)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
            setActiveStage(stage.key)
            return
          }
        }
      }

      const firstEl = document.getElementById(STAGES[0].key)
      if (firstEl && firstEl.getBoundingClientRect().top > triggerPoint) {
        setActiveStage(STAGES[0].key)
        return
      }

      const lastEl = document.getElementById(STAGES[STAGES.length - 1].key)
      if (lastEl && lastEl.getBoundingClientRect().bottom <= window.innerHeight + 100) {
        setActiveStage(STAGES[STAGES.length - 1].key)
        return
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  const scrollToStage = (key: StageKey) => {
    setActiveStage(key)
    isManualScroll.current = true

    const el = document.getElementById(key)
    if (el) {
      const yOffset = -96
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })

      setTimeout(() => {
        isManualScroll.current = false
      }, 750)
    }
  }

  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <section
      className="features-hero-dark relative border-t border-border/50"
      style={{ background: "var(--features-hero-bg)" }}
    >
      <div className="relative mx-auto w-full max-w-6xl px-6 py-12 md:px-8 md:py-16">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <span className="ai-pill-blue">
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" aria-hidden="true" />
            What&apos;s Included
          </span>
          <h2 className="mt-3 text-balance font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl md:whitespace-nowrap">
            Built for India&apos;s front desk, not just another voice AI.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground font-light">
            From setup to billing, every feature here is designed around how Indian businesses actually operate — TRAI-compliant, GST-ready, and priced the way you pay.
          </p>
        </ScrollReveal>

        <div className="sticky top-16 z-30 -mx-6 mt-8 flex gap-2 overflow-x-auto border-b border-border/40 bg-black/90 px-6 py-2.5 backdrop-blur-md lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STAGES.map((s, i) => {
            const isActive = s.key === activeStage
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => scrollToStage(s.key)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  isActive ? "shadow-md" : "border-border/60 bg-card/40 text-muted-foreground"
                }`}
                style={
                  isActive
                    ? {
                        borderColor: `color-mix(in srgb, ${s.accent} 60%, transparent)`,
                        background: `color-mix(in srgb, ${s.accent} 20%, transparent)`,
                        color: s.accent,
                        boxShadow: `0 0 12px color-mix(in srgb, ${s.accent} 30%, transparent)`,
                      }
                    : undefined
                }
              >
                <span
                  className="flex size-5 items-center justify-center rounded-full text-[10px] font-bold transition-all"
                  style={{
                    background: s.accent,
                    color: "#ffffff",
                    boxShadow: `0 0 6px ${s.accent}`,
                  }}
                >
                  {i + 1}
                </span>
                <span>{s.label}</span>
              </button>
            )
          })}
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-10 lg:grid-cols-[290px_1fr] lg:gap-14">
          <nav aria-label="Feature groups" className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <div className="space-y-1.5">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                Explore
              </p>
              {STAGES.map((s, i) => {
                const isActive = s.key === activeStage
                return (
                  <div
                    key={s.key}
                    className={`rounded-2xl transition-all duration-300 ${
                      isActive
                        ? "border shadow-lg"
                        : "border border-transparent hover:bg-white/[0.04]"
                    }`}
                    style={
                      isActive
                        ? {
                            background: `color-mix(in srgb, ${s.accent} 16%, transparent)`,
                            borderColor: `color-mix(in srgb, ${s.accent} 45%, transparent)`,
                            boxShadow: `0 0 24px -4px color-mix(in srgb, ${s.accent} 28%, transparent)`,
                          }
                        : undefined
                    }
                  >
                    <button
                      type="button"
                      onClick={() => scrollToStage(s.key)}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-base font-semibold transition-colors ${
                        isActive
                          ? "font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      style={{ color: isActive ? s.accent : undefined }}
                    >
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold transition-all duration-300"
                        style={{
                          background: isActive ? s.accent : `color-mix(in srgb, ${s.accent} 10%, transparent)`,
                          borderColor: isActive ? s.accent : `color-mix(in srgb, ${s.accent} 25%, transparent)`,
                          color: isActive ? "#ffffff" : `color-mix(in srgb, ${s.accent} 85%, white)`,
                          boxShadow: isActive ? `0 0 10px ${s.accent}` : undefined,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-heading">{s.label}</span>
                    </button>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-3.5 pb-3.5 pl-[52px] text-sm leading-relaxed text-muted-foreground/90 font-light">
                          {s.description}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>
          </nav>

          <div className="space-y-12">
            {STAGES.map((s) => (
              <section key={s.key} id={s.key} className="scroll-mt-24">
                <div className="flex items-baseline justify-between gap-4">
                  <h3
                    className="text-lg font-bold tracking-tight sm:text-xl font-heading"
                    style={{ color: s.accent }}
                  >
                    {s.label}
                  </h3>
                  <span className="shrink-0 text-xs font-medium text-muted-foreground font-mono">
                    {s.items.length} features
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground font-light">
                  {s.description}
                </p>

                <div
                  className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border bg-card/40 backdrop-blur-md shadow-lg transition-all duration-300"
                  style={{
                    borderColor: `color-mix(in srgb, ${s.accent} 35%, transparent)`,
                    boxShadow: `0 0 20px -4px color-mix(in srgb, ${s.accent} 15%, transparent)`,
                  }}
                >
                  {s.items.map((item) => {
                    const Icon = item.icon
                    const isOpen = !!openItems[item.title]
                    return (
                      <div key={item.title} className="transition-colors">
                        <button
                          type="button"
                          onClick={() => toggleItem(item.title)}
                          aria-expanded={isOpen}
                          className="flex w-full items-start gap-3.5 p-4 text-left transition-colors hover:bg-white/[0.03]"
                        >
                          <span
                            className="flex size-9 shrink-0 items-center justify-center rounded-lg border transition-transform duration-300"
                            style={{
                              background: `color-mix(in srgb, ${s.accent} 18%, transparent)`,
                              borderColor: `color-mix(in srgb, ${s.accent} 45%, transparent)`,
                              color: s.accent,
                              boxShadow: `0 0 10px color-mix(in srgb, ${s.accent} 25%, transparent)`,
                            }}
                          >
                            <Icon className="size-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-semibold text-foreground font-heading">
                                {item.title}
                              </h4>
                              <ChevronDown
                                className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                                  isOpen ? "rotate-180 text-foreground" : ""
                                }`}
                                style={{ color: isOpen ? s.accent : undefined }}
                                aria-hidden="true"
                              />
                            </div>
                            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground font-light">
                              {item.blurb}
                            </p>
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                  className="overflow-hidden"
                                >
                                  <p className="mt-2.5 pt-2.5 border-t border-border/40 text-xs leading-relaxed text-muted-foreground/90 font-light">
                                    {item.detail}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
