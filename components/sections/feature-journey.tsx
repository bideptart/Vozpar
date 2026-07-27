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
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

/**
 * FeatureJourney
 * Not another list of what the product can do — FeatureShowcase already owns
 * that. This is the lifecycle of actually running it: the five stages a team
 * moves through from "we just signed up" to "we trust this thing enough to
 * stop watching it every day". Content is deliberately different from the 12
 * technical capabilities above (latency, telephony, tools, etc.) — this is
 * the console and workflow around them.
 *
 * Left rail is a numbered stepper, not a tab bar — the five stages are
 * sequential, not four unordered categories, so the UI says so.
 */

type StageKey = "build" | "train" | "test" | "operate" | "account"

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
    key: "build",
    label: "Build & Setup",
    description: "Spin up agents and give each one a voice and a personality.",
    accent: "#3b82f6", // 1. Blue
    items: [
      {
        icon: Users,
        title: "Multi-agent management",
        blurb: "Create and manage as many AI agents as you need from a single account.",
        detail: "One dashboard, one login, one bill — whether you're running one number or fifty.",
      },
      {
        icon: AudioLines,
        title: "Voice selection",
        blurb: "Choose from a library of named voices, each with a personality and a preview clip.",
        detail: "Preview any voice against your own script before it ever answers a real call.",
      },
      {
        icon: SlidersHorizontal,
        title: "Call behavior controls",
        blurb: "Set how your agent greets callers, handles interruptions, and hands off conversations.",
        detail: "Greeting, tone, barge-in sensitivity, and handoff rules — tuned per agent, not global.",
      },
    ],
  },
  {
    key: "train",
    label: "Train & Configure",
    description: "Teach each agent your business and route calls the way you want.",
    accent: "#10b981", // 2. Green
    items: [
      {
        icon: BookOpen,
        title: "Knowledge base (per agent)",
        blurb: "Give each agent its own set of company facts, FAQs, and policies to draw on.",
        detail: "Paste in docs, pricing, or policies — the agent answers from your source of truth, not a guess.",
      },
      {
        icon: Copy,
        title: "Reusable knowledge templates",
        blurb: "Save a knowledge setup once and reuse it across multiple agents or numbers.",
        detail: "Clone a working setup to a new location instead of rebuilding it from scratch.",
      },
      {
        icon: GitBranch,
        title: "Behavior & routing rules",
        blurb: "Define escalation paths, working hours, and fallback numbers per agent.",
        detail: "After-hours routing, human escalation, and fallback numbers — set once, per agent.",
      },
    ],
  },
  {
    key: "test",
    label: "Test & Go Live",
    description: "Hear your agent before you ever risk a real caller on it.",
    accent: "#10b981", // 3. Green
    items: [
      {
        icon: FlaskConical,
        title: "Playground / live testing",
        blurb: "Test your agent before it ever answers a real caller.",
        detail: "Run through every branch of a script in a sandbox, with instant edits between takes.",
      },
      {
        icon: PhoneCall,
        title: "Live test call (dial-in)",
        blurb: "Dial your own number and hear exactly what a caller will.",
        detail: "The real telephony path, the real voice, the real latency — not a browser simulation.",
      },
      {
        icon: LayoutTemplate,
        title: "Ready-made setup templates",
        blurb: "Start from an industry-tuned playbook instead of a blank agent.",
        detail: "Real estate, dental, home services and more ship with scripts and routing pre-built.",
      },
    ],
  },
  {
    key: "operate",
    label: "Operate & Monitor",
    description: "Watch every call, everything it agreed to, down to the exact word.",
    accent: "#ff7a00", // 4. Orange
    items: [
      {
        icon: BarChart3,
        title: "Analytics dashboard",
        blurb: "Track volume, sentiment, call outcomes, and duration in one place.",
        detail: "The same numbers a call center manager watches, without the call center.",
      },
      {
        icon: CalendarCheck,
        title: "Booking history",
        blurb: "See every appointment your agent has booked, rescheduled, or cancelled.",
        detail: "A running ledger of every slot touched — no separate calendar to reconcile against.",
      },
      {
        icon: FileText,
        title: "Call transcripts & recordings",
        blurb: "Every call, searchable, with speaker labels and compliance-ready redaction.",
        detail: "Search a phrase across every call this month instead of listening back one at a time.",
      },
      {
        icon: LifeBuoy,
        title: "Support ticket explorer",
        blurb: "Read what your agent escalated and why, without listening to the call.",
        detail: "Every handoff to a human comes with the context — what was asked, and why it escalated.",
      },
    ],
  },
  {
    key: "account",
    label: "Account & Overview",
    description: "Manage the account, your team, and your agents' identity.",
    accent: "#ef4444", // 5. Red
    items: [
      {
        icon: Settings,
        title: "Account settings",
        blurb: "Manage billing, teammates, and access at a glance.",
        detail: "Seats, roles, and billing in one screen — no separate admin tool to log into.",
      },
      {
        icon: LayoutDashboard,
        title: "Dashboard overview",
        blurb: "See how your agents are performing across every number you run.",
        detail: "One glance at every agent's health before you drill into any single one.",
      },
      {
        icon: Fingerprint,
        title: "Agent identity setup",
        blurb: "Name your agent, set its persona, and connect its number.",
        detail: "The last step before go-live: a name, a persona, and a phone number, tied together.",
      },
    ],
  },
]

/** How long each stage sits active before the stepper auto-advances. */
const AUTO_ADVANCE_MS = 4500

export function FeatureJourney() {
  const reduced = useReducedMotion()
  const [activeStage, setActiveStage] = useState<StageKey>("build")
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)

  const stage = STAGES.find((s) => s.key === activeStage)!
  const activeIndex = STAGES.findIndex((s) => s.key === activeStage)
  const stepperRef = useRef<HTMLDivElement | null>(null)

  // Keeps the active chip visible on the phone rail as stages auto-advance.
  // On desktop the stepper is a vertical, non-scrolling column (overflow
  // visible), so this is a harmless no-op there — it only matters on the
  // horizontal snap-scroll rail below lg, where the active chip can otherwise
  // auto-advance itself right off the edge of the screen with nothing
  // telling you which stage you're even on anymore.
  useEffect(() => {
    const container = stepperRef.current
    const activeEl = container?.children[activeIndex] as HTMLElement | undefined
    if (!container || !activeEl) return
    const target = activeEl.offsetLeft - container.clientWidth / 2 + activeEl.clientWidth / 2
    container.scrollTo({ left: Math.max(0, target), behavior: reduced ? "auto" : "smooth" })
  }, [activeIndex, reduced])

  // Auto-advance through the stages on a timer — this is a tour, not just a
  // menu. Paused on hover/focus so it doesn't yank the content away from
  // someone mid-read, and restarts its full duration on every stage change
  // (auto or manual) rather than ticking on a fixed wall-clock cadence.
  useEffect(() => {
    if (paused || reduced) return
    const id = setTimeout(() => {
      setActiveStage(STAGES[(activeIndex + 1) % STAGES.length].key)
      setOpenItem(null)
    }, AUTO_ADVANCE_MS)
    return () => clearTimeout(id)
  }, [activeIndex, paused, reduced])

  const selectStage = (key: StageKey) => {
    setActiveStage(key)
    setOpenItem(null)
  }

  return (
    <section
      className="features-hero-dark relative overflow-hidden border-t border-border"
      style={{ background: "var(--features-hero-bg)" }}
    >
      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-16">
        <ScrollReveal className="mx-auto mb-6 max-w-2xl text-center md:mb-8">
          <span className="ai-pill-blue">
            <span className="h-1 w-1 rounded-full bg-current" />
            From signup to trusted
          </span>
          <h2 className="mt-5 text-balance font-heading text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
            Five stages from first agent to running the desk.
          </h2>
          <p className="mt-4 text-pretty text-[15px] font-light leading-relaxed text-muted-foreground">
            Not another list of capabilities — this is the console around them: how you build an agent, teach it,
            test it, and keep watching it once it&apos;s live.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div
            className="grid grid-cols-1 gap-6 lg:grid-cols-[17rem_1fr] lg:gap-8"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(e) => {
              // Only resume once focus has actually left the whole grid, not
              // just moved from one stepper button to the next inside it.
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false)
            }}
          >
            {/* ---------- STEPPER ---------- */}
            <div className="relative">
              <div
                ref={stepperRef}
                className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:snap-none lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
              >
                {STAGES.map((s, i) => {
                  const isActive = s.key === activeStage
                  const isLast = i === STAGES.length - 1
                  return (
                    <button
                      key={s.key}
                      type="button"
                      aria-current={isActive ? "step" : undefined}
                      onClick={() => selectStage(s.key)}
                      onPointerEnter={(e) => {
                        if (e.pointerType === "mouse") selectStage(s.key)
                      }}
                      onFocus={() => selectStage(s.key)}
                      className="group relative flex shrink-0 snap-start items-start gap-3 overflow-hidden rounded-xl border px-3 py-3 text-left transition-colors duration-200 lg:w-full lg:shrink lg:pb-6 lg:pt-3"
                      style={{
                        borderColor: isActive ? `color-mix(in srgb, ${s.accent} 50%, transparent)` : "transparent",
                        background: isActive ? `color-mix(in srgb, ${s.accent} 12%, transparent)` : undefined,
                        boxShadow: isActive ? `0 0 20px -3px color-mix(in srgb, ${s.accent} 25%, transparent)` : undefined,
                      }}
                    >
                      {/* Connecting line behind the numbers, desktop only */}
                      {!isLast && (
                        <span
                          aria-hidden
                          className="absolute left-[27px] top-11 hidden h-full w-px lg:block"
                          style={{ background: "var(--border)" }}
                        />
                      )}
                      {isActive && !reduced && (
                        <span
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden rounded-full bg-white/5 lg:left-3 lg:right-3 lg:bottom-1"
                        >
                          <span
                            key={s.key}
                            className="journey-progress-fill block h-full rounded-full"
                            style={{
                              background: s.accent,
                              boxShadow: `0 0 8px ${s.accent}`,
                              animationDuration: `${AUTO_ADVANCE_MS}ms`,
                              animationPlayState: paused ? "paused" : "running",
                            }}
                          />
                        </span>
                      )}
                      <span
                        className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-medium tabular-nums transition-all duration-300 group-hover:scale-105"
                        style={{
                          background: isActive ? s.accent : `color-mix(in srgb, ${s.accent} 10%, transparent)`,
                          borderColor: isActive ? s.accent : `color-mix(in srgb, ${s.accent} 25%, transparent)`,
                          color: isActive ? "#ffffff" : `color-mix(in srgb, ${s.accent} 85%, white)`,
                          boxShadow: isActive ? `0 0 10px ${s.accent}` : undefined,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 max-w-[11rem] lg:max-w-none">
                        <span
                          className={`block font-heading text-sm font-medium tracking-[-0.01em] transition-colors duration-300 ${
                            isActive ? "font-bold" : "text-muted-foreground group-hover:text-foreground"
                          }`}
                          style={{ color: isActive ? s.accent : undefined }}
                        >
                          {s.label}
                        </span>
                        <span className="mt-1 hidden text-xs font-light leading-relaxed text-muted-foreground lg:block">
                          {isActive ? s.description : ""}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ---------- ACCORDION ---------- */}
            <div>
              <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-border pb-2.5">
                <span className="font-heading text-base font-medium tracking-[-0.015em]" style={{ color: stage.accent }}>
                  {stage.label}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
                  {stage.items.length} {stage.items.length === 1 ? "feature" : "features"}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={stage.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-2"
                >
                  {stage.items.map((item) => {
                    const Icon = item.icon
                    const isOpen = openItem === item.title
                    return (
                      <div
                        key={item.title}
                        className="group/item overflow-hidden rounded-xl border bg-card/30 transition-all duration-300 shadow-sm"
                        style={{
                          borderColor: `color-mix(in srgb, ${stage.accent} 35%, transparent)`,
                          boxShadow: `0 0 16px -4px color-mix(in srgb, ${stage.accent} 15%, transparent)`,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenItem(isOpen ? null : item.title)}
                          aria-expanded={isOpen}
                          className="flex w-full items-start gap-3 px-3.5 py-3 text-left"
                        >
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-transform duration-300 group-hover/item:scale-105"
                            style={{
                              background: `color-mix(in srgb, ${stage.accent} 18%, transparent)`,
                              borderColor: `color-mix(in srgb, ${stage.accent} 45%, transparent)`,
                              color: stage.accent,
                              boxShadow: `0 0 10px color-mix(in srgb, ${stage.accent} 25%, transparent)`,
                            }}
                          >
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium leading-snug text-foreground">
                              {item.title}
                            </span>
                            <span className="mt-0.5 block text-xs font-light leading-snug text-muted-foreground">
                              {item.blurb}
                            </span>
                          </span>
                          <ChevronDown
                            className={`mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            style={{ color: isOpen ? stage.accent : undefined }}
                            aria-hidden
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <p
                                className="border-t px-3.5 py-3 pl-[3.25rem] text-xs font-light leading-relaxed text-muted-foreground"
                                style={{ borderColor: "var(--border)" }}
                              >
                                {item.detail}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
