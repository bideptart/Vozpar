"use client"

<<<<<<< HEAD
import type React from "react"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, PhoneCall, Sparkles } from "lucide-react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react"
import { HeroOrbs, HeroParticles, HeroIconBadges, HeroLightSweep } from "@/components/sections/hero-fx"
import { HeroVoiceOrb } from "@/components/sections/hero-orb"
import { industriesHeading, industriesBody, industriesMono } from "@/lib/industries-fonts"
=======
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, PhoneCall, Sparkles, Mic, Volume2, Cpu, Radio } from "lucide-react"
import { AnimatePresence, animate, motion, useReducedMotion, type Variants } from "motion/react"
import { useIsMobile } from "@/hooks/use-mobile"

/**
 * The call the panel is demoing, cycling on a loop. Previously this was two
 * hardcoded, permanently-static bubbles — the "generating" label and its
 * three dots never actually resolved into anything, so the whole panel read
 * as a screenshot rather than a live agent. Each turn now plays through a
 * caller line → a beat of "generating" → the agent's reply landing, then
 * holds before the next turn replaces it and the footer telemetry (latency/
 * sentiment/intent) updates to match.
 */
const CALL_SCRIPT = [
  {
    callerTime: "00:14",
    caller: "Hi, I'm calling about the listing on Maple Street.",
    agentTime: "00:15",
    agent: "Of course — the 4-bed colonial. Are you looking to schedule a showing this week?",
    intent: "Book showing",
  },
  {
    callerTime: "00:22",
    caller: "Actually, is it free Saturday afternoon?",
    agentTime: "00:23",
    agent: "Saturday at 2 PM works — you're booked, and I've texted the address over.",
    intent: "Showing booked",
  },
  {
    callerTime: "00:31",
    caller: "Perfect, thank you so much!",
    agentTime: "00:32",
    agent: "You're welcome — I'll send a reminder an hour before. Anything else?",
    intent: "Wrapping up",
  },
] as const

const TURN_HOLD_MS = 4200
const GENERATING_DELAY_MS = 950

/** Counts up from 0 to `target` once on mount — the trust-stat number sat
 * there fully formed with no entrance of its own, while everything else in
 * the hero animates in. `delay` lines up with the stat row's own fade-in
 * (see the `transition` on its wrapping motion.div) so the count starts
 * right as the row becomes visible instead of before or well after. */
function AnimatedNumber({ target, delay = 0 }: { target: number; delay?: number }) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(reduced ? target : 0)

  useEffect(() => {
    if (reduced) return
    const controls = animate(0, target, {
      duration: 1.2,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [target, delay, reduced])

  return <>{value}</>
}

/** Rotating call scenarios for the Voice Operations Core panel. It used to
 * hardcode a single "Maple Street" call forever — every loop replayed the
 * identical caller line, intent, and outcome, which reads as a canned demo
 * rather than a live system. Each full step-cycle now advances to the next
 * scenario, so the panel actually shows different calls over time. */
const VOICE_SCENARIOS = [
  {
    callerQuote: "I need an appointment Saturday.",
    intent: "Book appointment",
    calendarStatus: "Checking availability",
    crmStatus: "Customer matched",
    outcomeLabel: "Appointment booked",
    outcomeTime: "Saturday · 2:00 PM",
  },
  {
    callerQuote: "Table for four this Friday?",
    intent: "Reserve table",
    calendarStatus: "Checking floor plan",
    crmStatus: "Regular guest found",
    outcomeLabel: "Reservation confirmed",
    outcomeTime: "Friday · 7:30 PM",
  },
  {
    callerQuote: "Can I reschedule my cleaning?",
    intent: "Reschedule visit",
    calendarStatus: "Finding new slot",
    crmStatus: "Patient record pulled",
    outcomeLabel: "Visit rescheduled",
    outcomeTime: "Tuesday · 10:15 AM",
  },
  {
    callerQuote: "Any slots for a haircut today?",
    intent: "Book haircut",
    calendarStatus: "Checking stylist",
    crmStatus: "Client history loaded",
    outcomeLabel: "Appointment booked",
    outcomeTime: "Today · 4:45 PM",
  },
] as const

/**
 * Living Voice Operations Core - Visualizes a real voice call workflow
 */
function VoiceOperationsCore({ reduced }: { reduced: boolean }) {
  const [step, setStep] = useState(0)
  const [scenario, setScenario] = useState(0)
  const [hoverCore, setHoverCore] = useState(false)
  const [hoverTool, setHoverTool] = useState<string | null>(null)
  const isFirstLoop = useRef(true)

  const totalSteps = 8
  // Was 1.2s/step (a ~12s loop) — trimmed to 0.8s so the whole call resolves
  // in well under a beat and reads as snappy/live rather than a slow slideshow.
  const stepDuration = 0.8 // seconds

  useEffect(() => {
    if (reduced) return
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % (totalSteps + 2)) // +2 for hold
    }, (stepDuration * 1000))
    return () => clearInterval(interval)
  }, [reduced])

  // Advance to the next scenario every time a loop completes (step wraps
  // back to 0), skipping the very first mount so the initial scenario holds
  // for a full cycle before switching.
  useEffect(() => {
    if (step !== 0) return
    if (isFirstLoop.current) {
      isFirstLoop.current = false
      return
    }
    setScenario((s) => (s + 1) % VOICE_SCENARIOS.length)
  }, [step])

  const current = VOICE_SCENARIOS[scenario]
  // Only the visible layout gets mounted (see note below) — this decides
  // which one, on the same breakpoint the markup used to hide/show via CSS.
  const isMobile = useIsMobile()

  const isActive = (min: number, max: number) => step >= min && step <= max
  
  return (
    <div 
      className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#05060B] to-[#07090D] border border-[#1e2329] p-4 shadow-[0_0_40px_rgba(56,189,248,0.05)] sm:p-6 md:p-8"
      onClick={() => !reduced && setStep(0)}
    >
      {/* Subtle animated grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(rgba(56,189,248,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.5) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <motion.div 
          className="absolute inset-0"
          animate={
            reduced
              ? undefined
              : {
                  backgroundPosition: ['0px 0px', '20px 20px'],
                }
          }
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
        />
      </div>
      
      {/* Content container with proper z-index */}
      <div className="relative z-10">
      {/* Performance indicators */}
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Live call processing
          </span>
        </div>
      </div>

      {/* Desktop layout — brought back, but rescaled. The original build was
          sized for a wide, unconstrained container (192px core, full-text
          caller/tool cards on fixed 160px offsets); inside the hero's
          two-column grid the panel only ever gets ~5/12 of max-w-7xl
          (~450–500px), so at that size the caller card overlapped the core.
          Same three-node layout and same motion/timing, just scaled down
          (~60%) so caller, core, and tool cards all fit side by side with
          clearance to spare even at the narrowest (1024px, lg breakpoint)
          width. */}
      {!isMobile && (
      <div>
        <div className="relative h-[260px]">
          {/* Caller Signal (Left) */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: isActive(0, 8) ? 1 : 0,
              x: isActive(0, 8) ? 0 : -20,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="flex items-center gap-2 bg-[#050607] border border-amber-500/40 rounded-2xl px-2.5 py-1.5 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <div className="flex flex-col items-center justify-center w-6 h-6 shrink-0 rounded-full bg-amber-500/10 text-amber-400">
                  <PhoneCall className="w-3 h-3" />
                </div>
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-amber-400/80">Caller</p>
                  <p className="max-w-[92px] text-[10px] leading-snug text-foreground/90">&quot;{current.callerQuote}&quot;</p>
                </div>
              </div>
              {/* Animated line to core */}
              <motion.div
                className="absolute left-full top-1/2 w-6 h-px bg-gradient-to-r from-amber-500/50 to-transparent origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isActive(1, 8) ? 1 : 0 }}
                transition={{ duration: 0.6 }}
              />
              {/* Pulse */}
              {!reduced && isActive(1, 2) && (
                <motion.div
                  className="absolute left-full top-1/2 w-1.5 h-1.5 rounded-full bg-amber-400"
                  initial={{ x: 0, opacity: 1 }}
                  animate={{ x: 24, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "linear" }}
                />
              )}
            </div>
          </motion.div>

          {/* Central Voice Core */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            onMouseEnter={() => setHoverCore(true)}
            onMouseLeave={() => setHoverCore(false)}
          >
            <div className="relative w-28 h-28">
              {/* Outer glow */}
              <motion.div
                className="absolute -inset-2 rounded-full blur-xl"
                style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)' }}
                animate={
                  reduced
                    ? undefined
                    : {
                        opacity: hoverCore ? [0.2, 0.4, 0.2] : [0.15, 0.3, 0.15],
                        scale: hoverCore ? [1, 1.1, 1] : 1,
                      }
                }
                transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              {/* Outer breathing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/20"
                animate={
                  reduced
                    ? undefined
                    : {
                        scale: hoverCore ? [1, 1.06, 1] : [1, 1.04, 1],
                        opacity: hoverCore ? [0.35, 0.55, 0.35] : [0.25, 0.45, 0.25],
                      }
                }
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />

              {/* Middle ring */}
              <motion.div
                className="absolute inset-2 rounded-full border border-primary/30"
                animate={
                  reduced
                    ? undefined
                    : {
                        scale: hoverCore ? [1, 1.04, 1] : [1, 1.02, 1],
                        opacity: hoverCore ? [0.4, 0.6, 0.4] : [0.3, 0.5, 0.3],
                      }
                }
                transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.2 }}
              />

              {/* Waveform lines */}
              {!reduced && (
                <div className="absolute inset-4 flex items-center justify-center">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 mx-0.5 rounded-full bg-gradient-to-t from-primary/40 via-primary to-[#38bdf8]"
                      initial={{ height: 4 }}
                      animate={{
                        height: isActive(2, 8) || hoverCore
                          ? [5, 18 + (i % 4) * 3, 6, 15 + (i % 3) * 2, 5]
                          : 4,
                        opacity: isActive(2, 8) || hoverCore ? [0.7, 1, 0.8] : 0.6,
                      }}
                      transition={{
                        duration: 0.35,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.08,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Inner core */}
              <div className="absolute inset-7 rounded-full bg-[#050607] border border-primary/40 flex items-center justify-center overflow-hidden">
                {/* Voice energy particles */}
                {!reduced && isActive(2, 8) && (
                  <>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          background: i % 2 === 0 ? '#38bdf8' : 'var(--ai-primary)',
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 0.95, 0.4, 0],
                          scale: [0, 1.3, 0.8, 0],
                          x: Math.cos((i * Math.PI) / 4) * 23,
                          y: Math.sin((i * Math.PI) / 4) * 23,
                        }}
                        transition={{
                          duration: 2.2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Central sound wave indicator */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    className="absolute w-7 h-7 rounded-full border border-primary/30"
                    animate={
                      reduced
                        ? undefined
                        : {
                            scale: isActive(2, 8) ? [1, 1.4, 1] : 1,
                            opacity: isActive(2, 8) ? [0.2, 0.5, 0.2] : 0.2,
                          }
                    }
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute w-5 h-5 rounded-full border border-primary/40"
                    animate={
                      reduced
                        ? undefined
                        : {
                            scale: isActive(2, 8) ? [1, 1.25, 1] : 1,
                            opacity: isActive(2, 8) ? [0.3, 0.6, 0.3] : 0.3,
                          }
                    }
                    transition={{
                      duration: 1.2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                  />
                  <div className="relative w-3 h-3 rounded-full bg-primary/20 flex items-center justify-center">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={
                        reduced
                          ? undefined
                          : {
                              scale: isActive(2, 8) ? [1, 1.3, 1] : 1,
                            }
                      }
                      transition={{
                        duration: 0.8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Intent detected label */}
              <motion.div
                className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: isActive(3, 8) ? 1 : 0,
                  y: isActive(3, 8) ? 0 : 10,
                }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-[#050607] border border-primary/40 rounded-xl px-2 py-1">
                  <p className="font-mono text-[7px] uppercase tracking-[0.15em] text-primary/80">
                    Intent detected
                  </p>
                  <p className="text-[10px] text-foreground">{current.intent}</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Tool nodes (Right) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {/* Lines from core */}
            <svg className="absolute right-9 top-0 w-9 h-9 overflow-visible">
              <motion.path
                d="M 0 12 Q 12 12 18 0"
                stroke={hoverTool === "calendar" ? "#38bdf8" : "rgba(56, 189, 248, 0.3)"}
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isActive(4, 8) ? 1 : 0 }}
                transition={{ duration: 0.6 }}
              />
              {!reduced && isActive(4, 5) && (
                <motion.circle
                  r="2"
                  fill="#38bdf8"
                  initial={{ cx: 0, cy: 12 }}
                  animate={{ cx: 18, cy: 0 }}
                  transition={{ duration: 0.6, ease: "linear" }}
                />
              )}
            </svg>
            <svg className="absolute right-9 bottom-0 w-9 h-9 overflow-visible">
              <motion.path
                d="M 0 12 Q 12 12 18 24"
                stroke={hoverTool === "crm" ? "#38bdf8" : "rgba(56, 189, 248, 0.3)"}
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isActive(4, 8) ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              />
              {!reduced && isActive(4, 5) && (
                <motion.circle
                  r="2"
                  fill="#38bdf8"
                  initial={{ cx: 0, cy: 12 }}
                  animate={{ cx: 18, cy: 24 }}
                  transition={{ duration: 0.6, ease: "linear", delay: 0.2 }}
                />
              )}
            </svg>

            <div className="flex flex-col gap-2">
              {/* Calendar */}
              <motion.div
                onMouseEnter={() => setHoverTool("calendar")}
                onMouseLeave={() => setHoverTool(null)}
                className="relative bg-[#050607] border border-[#38bdf8]/40 rounded-2xl px-2.5 py-1.5 shadow-[0_0_20px_rgba(56,189,248,0.1)]"
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: isActive(5, 8) ? 1 : 0,
                  x: isActive(5, 8) ? 0 : 20,
                  borderColor: hoverTool === "calendar" ? "rgba(56, 189, 248, 0.7)" : "rgba(56, 189, 248, 0.3)",
                }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center justify-center w-6 h-6 shrink-0 rounded-full bg-[#38bdf8]/10 text-[#38bdf8]">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#38bdf8]/80">Calendar</p>
                    <p className="whitespace-nowrap text-[10px] text-foreground/90">{current.calendarStatus}</p>
                  </div>
                </div>
              </motion.div>

              {/* CRM */}
              <motion.div
                onMouseEnter={() => setHoverTool("crm")}
                onMouseLeave={() => setHoverTool(null)}
                className="relative bg-[#050607] border border-[#38bdf8]/40 rounded-2xl px-2.5 py-1.5 shadow-[0_0_20px_rgba(56,189,248,0.1)]"
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: isActive(5, 8) ? 1 : 0,
                  x: isActive(5, 8) ? 0 : 20,
                  borderColor: hoverTool === "crm" ? "rgba(56, 189, 248, 0.7)" : "rgba(56, 189, 248, 0.3)",
                }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center justify-center w-6 h-6 shrink-0 rounded-full bg-[#38bdf8]/10 text-[#38bdf8]">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#38bdf8]/80">CRM</p>
                    <p className="whitespace-nowrap text-[10px] text-foreground/90">{current.crmStatus}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Outcome (Bottom) */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: isActive(7, 8) ? 1 : 0,
              y: isActive(7, 8) ? 0 : -10,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-[#050607] border border-emerald-500/50 rounded-2xl px-4 py-2 text-center shadow-[0_0_25px_rgba(16,185,129,0.12)]">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="relative flex h-1.5 w-1.5">
                  {!reduced && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-emerald-400/80">
                  {current.outcomeLabel}
                </p>
              </div>
              <p className="text-sm font-semibold text-foreground">{current.outcomeTime}</p>
            </div>
          </motion.div>
        </div>
      </div>
      )}

      {/* Mobile layout — flow-based fallback below md, where the panel is
          full viewport width but still too narrow for the scaled desktop
          version above with comfortable touch spacing. Both layouts used to
          be permanently mounted with Tailwind `hidden`/`md:hidden` classes
          doing the swap — CSS `display:none` hides the paint, but every
          motion.div underneath (waveform bars, particles, breathing rings,
          the rotating grid) kept running its rAF loop regardless, so the
          hero panel was animating two full copies of itself at once, all
          the time. Now only the layout that's actually visible is mounted
          at all, gated by the same 768px breakpoint via `useIsMobile`. */}
      {isMobile && (
      <div>
        <div className="space-y-3">
          {/* Caller */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: isActive(0, 8) ? 1 : 0,
              x: isActive(0, 8) ? 0 : -20,
            }}
            transition={{ duration: 0.5 }}
            className="bg-[#050607] border border-amber-500/40 rounded-2xl px-3 py-2 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col items-center justify-center w-7 h-7 shrink-0 rounded-full bg-amber-500/10 text-amber-400">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber-400/80">Caller</p>
                <p className="text-xs text-foreground/90">&quot;{current.callerQuote}&quot;</p>
              </div>
            </div>
          </motion.div>

          {/* Core */}
          <div className="flex justify-center py-1">
            <div
              className="relative w-28 h-28"
              onMouseEnter={() => setHoverCore(true)}
              onMouseLeave={() => setHoverCore(false)}
            >
              {/* Outer glow */}
              <motion.div
                className="absolute -inset-2 rounded-full blur-xl"
                style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)' }}
                animate={
                  reduced
                    ? undefined
                    : {
                        opacity: hoverCore ? [0.2, 0.4, 0.2] : [0.15, 0.3, 0.15],
                        scale: hoverCore ? [1, 1.1, 1] : 1,
                      }
                }
                transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />

              {/* Outer breathing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/20"
                animate={
                  reduced
                    ? undefined
                    : {
                        scale: hoverCore ? [1, 1.06, 1] : [1, 1.04, 1],
                        opacity: hoverCore ? [0.35, 0.55, 0.35] : [0.25, 0.45, 0.25],
                      }
                }
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />

              {/* Middle ring */}
              <motion.div
                className="absolute inset-3 rounded-full border border-primary/30"
                animate={
                  reduced
                    ? undefined
                    : {
                        scale: hoverCore ? [1, 1.05, 1] : [1, 1.02, 1],
                        opacity: hoverCore ? [0.4, 0.6, 0.4] : [0.3, 0.5, 0.3],
                      }
                }
                transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.2 }}
              />

              {/* Waveform lines */}
              {!reduced && (
                <div className="absolute inset-6 flex items-center justify-center">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 mx-0.5 rounded-full bg-gradient-to-t from-primary/40 via-primary to-[#38bdf8]"
                      initial={{ height: 4 }}
                      animate={{
                        height: isActive(2, 8) || hoverCore
                          ? [5, 17 + (i % 4) * 3, 6, 13 + (i % 3) * 2, 5]
                          : 4,
                        opacity: isActive(2, 8) || hoverCore ? [0.7, 1, 0.8] : 0.6,
                      }}
                      transition={{
                        duration: 0.35,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.08,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Inner core */}
              <div className="absolute inset-8 rounded-full bg-[#050607] border border-primary/40 flex items-center justify-center overflow-hidden">
                {/* Voice energy particles */}
                {!reduced && isActive(2, 8) && (
                  <>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          background: i % 2 === 0 ? '#38bdf8' : 'var(--ai-primary)',
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 0.95, 0.4, 0],
                          scale: [0, 1.3, 0.8, 0],
                          x: Math.cos((i * Math.PI) / 4) * 24,
                          y: Math.sin((i * Math.PI) / 4) * 24,
                        }}
                        transition={{
                          duration: 2.2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Central sound wave indicator */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    className="absolute w-7 h-7 rounded-full border border-primary/30"
                    animate={
                      reduced
                        ? undefined
                        : {
                            scale: isActive(2, 8) ? [1, 1.4, 1] : 1,
                            opacity: isActive(2, 8) ? [0.2, 0.5, 0.2] : 0.2,
                          }
                    }
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute w-5 h-5 rounded-full border border-primary/40"
                    animate={
                      reduced
                        ? undefined
                        : {
                            scale: isActive(2, 8) ? [1, 1.25, 1] : 1,
                            opacity: isActive(2, 8) ? [0.3, 0.6, 0.3] : 0.3,
                          }
                    }
                    transition={{
                      duration: 1.2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                  />
                  <div className="relative w-3 h-3 rounded-full bg-primary/20 flex items-center justify-center">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={
                        reduced
                          ? undefined
                          : {
                              scale: isActive(2, 8) ? [1, 1.3, 1] : 1,
                            }
                      }
                      transition={{
                        duration: 0.8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Intent */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isActive(3, 8) ? 1 : 0,
              y: isActive(3, 8) ? 0 : 10,
            }}
            transition={{ duration: 0.4 }}
            className="bg-[#050607] border border-primary/40 rounded-xl px-3 py-1.5 text-center"
          >
            <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-primary/80">
              Intent detected
            </p>
            <p className="text-xs text-foreground">{current.intent}</p>
          </motion.div>

          {/* Tools */}
          <div className="grid grid-cols-2 gap-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: isActive(5, 8) ? 1 : 0,
                x: isActive(5, 8) ? 0 : 20,
              }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => setHoverTool("calendar")}
              onMouseLeave={() => setHoverTool(null)}
              className="bg-[#050607] border border-[#38bdf8]/40 rounded-2xl px-3 py-2 shadow-[0_0_20px_rgba(56,189,248,0.1)]"
            >
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center justify-center w-6 h-6 shrink-0 rounded-full bg-[#38bdf8]/10 text-[#38bdf8]">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#38bdf8]/80">Calendar</p>
                  <p className="text-[11px] text-foreground/90">{current.calendarStatus}</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: isActive(5, 8) ? 1 : 0,
                x: isActive(5, 8) ? 0 : 20,
              }}
              transition={{ duration: 0.4, delay: 0.1 }}
              onMouseEnter={() => setHoverTool("crm")}
              onMouseLeave={() => setHoverTool(null)}
              className="bg-[#050607] border border-[#38bdf8]/40 rounded-2xl px-3 py-2 shadow-[0_0_20px_rgba(56,189,248,0.1)]"
            >
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center justify-center w-6 h-6 shrink-0 rounded-full bg-[#38bdf8]/10 text-[#38bdf8]">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  </svg>
                </div>
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#38bdf8]/80">CRM</p>
                  <p className="text-[11px] text-foreground/90">{current.crmStatus}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Outcome */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: isActive(7, 8) ? 1 : 0,
              y: isActive(7, 8) ? 0 : -10,
            }}
            transition={{ duration: 0.5 }}
            className="bg-[#050607] border border-emerald-500/50 rounded-2xl px-4 py-2 text-center shadow-[0_0_25px_rgba(16,185,129,0.12)]"
          >
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <span className="relative flex h-1.5 w-1.5">
                {!reduced && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-400/80">
                {current.outcomeLabel}
              </p>
            </div>
            <p className="text-sm font-semibold text-foreground">{current.outcomeTime}</p>
          </motion.div>
        </div>
      </div>
      )}

      {/* Performance indicators bottom */}
      <div className="mt-4 flex items-center justify-between gap-2 text-center sm:mt-6">
        <div className="flex-1">
          <p className="text-sm font-semibold tracking-tight text-primary sm:text-lg">&lt;300ms</p>
          <p className="text-[8px] uppercase tracking-[0.15em] text-muted-foreground sm:text-[10px]">Latency</p>
        </div>
        <div className="w-px h-6 bg-border/40 sm:h-8" />
        <div className="flex-1">
          <p className="text-sm font-semibold tracking-tight text-primary sm:text-lg">Natural</p>
          <p className="text-[8px] uppercase tracking-[0.15em] text-muted-foreground sm:text-[10px]">Interrupts</p>
        </div>
        <div className="w-px h-6 bg-border/40 sm:h-8" />
        <div className="flex-1">
          <p className="text-sm font-semibold tracking-tight text-emerald-400 sm:text-lg">Live</p>
          <p className="text-[8px] uppercase tracking-[0.15em] text-muted-foreground sm:text-[10px]">Actions</p>
        </div>
      </div>
      </div>
    </div>
  )
}
>>>>>>> 1381d76d59ff11bc4f695c233c035fb979dd943b

/**
 * Second full redesign of the homepage hero, per explicit request for a
 * "completely different, unique, and animated" treatment. Replaces the
 * previous two-column copy/dashboard-panel layout with a single centered
 * column: a clip-path "wipe" headline reveal (rather than word-by-word
 * blur-in), cursor-tracked parallax on the background orbs/particles, a
 * scroll-linked fade/parallax exit as the section scrolls past, and a new
 * centerpiece — HeroVoiceOrb (hero-orb.tsx), a circular radial-waveform +
 * pulsing AI orb visualization with floating transcript/stat chips —
 * replacing the old rectangular "dashboard mockup" panel entirely. Still
 * solid black + hero-fx.tsx ambient accents, still page-scoped (no imports
 * from components/industries/). Also now reuses the /industries page's
 * font system (industriesHeading = Archivo, industriesBody = Inter,
 * industriesMono for the eyebrow) per explicit request — see the updated
 * note in lib/industries-fonts.ts; this is a shared typography module, not
 * a page-scoped visual component, so reusing it across pages is intentional
 * and doesn't conflict with the industries-only-components convention.
 */
export function Hero() {
  const reduced = useReducedMotion()
  const [turn, setTurn] = useState(0)
  const [agentRevealed, setAgentRevealed] = useState(reduced ? true : false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasPlayedRef = useRef(false)

  const sectionRef = useRef<HTMLElement>(null)

  // Cursor-tracked parallax on the background layers
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const parallaxSpring = { stiffness: 60, damping: 20, mass: 0.6 }
  const psx = useSpring(px, parallaxSpring)
  const psy = useSpring(py, parallaxSpring)
  const orbsX = useTransform(psx, [-0.5, 0.5], [-24, 24])
  const orbsY = useTransform(psy, [-0.5, 0.5], [-18, 18])
  const particlesX = useTransform(psx, [-0.5, 0.5], [12, -12])
  const particlesY = useTransform(psy, [-0.5, 0.5], [9, -9])

  function handleSectionMove(e: React.MouseEvent<HTMLElement>) {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleSectionLeave() {
    px.set(0)
    py.set(0)
  }

  // Scroll-linked exit parallax
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] })
  const scrollOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2])
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -60])

  useEffect(() => {
    const audio = new Audio("/hpvoice.mp3")
    audio.preload = "auto"
    audio.load()
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  // Every new turn starts with just the caller line visible and the agent
  // bubble in its "generating" state; after a short beat the reply lands.
  // Reduced-motion users get the resolved reply immediately — the loop
  // itself (turn cycling) still runs, but nothing sits mid-"typing" forever
  // for them.
  useEffect(() => {
    setAgentRevealed(!!reduced)
    if (reduced) return
    const id = setTimeout(() => setAgentRevealed(true), GENERATING_DELAY_MS)
    return () => clearTimeout(id)
  }, [turn, reduced])

  useEffect(() => {
    if (reduced) return
    const id = setTimeout(() => setTurn((t) => (t + 1) % CALL_SCRIPT.length), TURN_HOLD_MS)
    return () => clearTimeout(id)
  }, [turn, reduced])

  const playHoverAudio = () => {
    if (hasPlayedRef.current) return
    const audio = audioRef.current
    if (!audio) return
    hasPlayedRef.current = true
    audio.currentTime = 0
    audio.play().catch(() => {
      hasPlayedRef.current = false
    })
  }

  const lineReveal: Variants = {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    visible: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] } },
  }

  return (
<<<<<<< HEAD
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMove}
      onMouseLeave={handleSectionLeave}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-black"
    >
      {/* Layered background — solid black, no grid (per explicit request, matching /industries) */}
      <motion.div style={reduced ? undefined : { x: orbsX, y: orbsY }} className="absolute inset-0">
        <HeroOrbs />
      </motion.div>
      <motion.div style={reduced ? undefined : { x: particlesX, y: particlesY }} className="absolute inset-0">
        <HeroParticles />
      </motion.div>
      <HeroIconBadges />
      {!reduced && <HeroLightSweep />}

      <motion.div
        style={reduced ? undefined : { opacity: scrollOpacity, y: scrollY }}
        className={`relative z-10 mx-auto w-full max-w-4xl px-4 py-24 text-center md:px-6 ${industriesBody.className}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="ai-pill-cyan mx-auto"
          style={{ fontFamily: industriesMono }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Live
          <span className="h-3 w-px bg-white/20" />
          v9278.audio-1
          <span className="h-3 w-px bg-white/20" />
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Native audio · Sub-second latency · Self-hosted
        </motion.div>

        {/* Headline — clip-path "wipe" reveal, one line at a time */}
        <h1
          className={`mt-7 text-balance font-normal leading-[1.03] tracking-tight text-white ${industriesHeading.className}`}
        >
          <motion.div initial="hidden" animate="visible" variants={lineReveal} className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px]">
            AI voice agents that
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={lineReveal}
            transition={{ delay: 0.25 }}
            className="mt-1 text-4xl italic text-primary sm:text-5xl md:text-6xl lg:text-[68px]"
          >
            actually sound human.
          </motion.div>
        </h1>
=======
    <section className="relative overflow-hidden">
      {/* Layered background. The old `bg-grid` layer here was dead weight —
          that class paints nothing site-wide (see globals.css, neutralised
          on an earlier request) — so it was doing literally nothing behind
          the content. Replaced with a real top vignette, the same technique
          used on /industries' hero, confined to the first ~500px so it
          reads as depth behind the headline rather than a wash over the
          whole section. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(45,152,241,0.10),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-neural opacity-50"
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-32 h-[460px] w-[460px] rounded-full blur-[120px] [will-change:transform]"
        style={{ background: "var(--ai-cyan)", opacity: 0.07 }}
        animate={reduced ? undefined : { x: [0, 60, -40, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] rounded-full blur-[120px] [will-change:transform]"
        style={{ background: "var(--ai-magenta)", opacity: 0.05 }}
        animate={reduced ? undefined : { x: [0, -50, 30, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 22, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-12 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-12 lg:gap-10 lg:py-6">
        {/* LEFT: Copy */}
        <div className="lg:col-span-7">
          {/* Status pill — the descriptor clause used to run on the same
              line with no wrap allowed, so on a phone it either overflowed
              the viewport or got clipped by the card's own width. Below
              `sm` it now drops to its own line and the divider hides, so
              "Live · v9278.audio-1" stays a tidy single row and the longer
              claim reads as a second line instead of fighting for space. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-full border border-border/60 bg-card/40 px-3.5 py-1.5 text-xs text-muted-foreground shadow-[0_0_24px_rgba(45,152,241,0.08)] backdrop-blur-md sm:px-4"
          >
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary sm:h-2 sm:w-2" />
              </span>
              <span className="text-[11px] font-medium text-foreground/90 sm:text-xs">Live</span>
              <span className="h-3 w-px bg-border/80" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary sm:text-[10px]">v9278.audio-1</span>
            </span>
            <span className="hidden h-3 w-px bg-border/80 sm:block" />
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
              Native audio · Sub-second latency · Self-hosted
            </span>
          </motion.div>

          {/* Headline — Archivo (brand heading face) instead of the legacy
              serif. The serif read as a mismatched, dated accent against
              the rest of the site's sans-only system (already migrated on
              /features); this brings the homepage hero in line with it. The
              accent phrase gets a blue→cyan gradient fill rather than flat
              italic colour, which reads as considerably more "alive" next
              to the live agent panel on the right. */}
          <motion.h1
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.07, delayChildren: 0.2 }}
            className="mt-5 text-balance font-heading text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl"
          >
            {headline.map((w, i) => (
              <motion.span key={`h-${i}`} variants={word} className="mr-3 inline-block">
                {w}
              </motion.span>
            ))}
            <br className="hidden md:block" />
            <motion.span
              variants={word}
              className="mr-3 inline-block bg-gradient-to-r from-[var(--ai-cyan)] to-primary bg-clip-text text-transparent"
            >
              actually
            </motion.span>
            <motion.span
              variants={word}
              className="mr-3 inline-block bg-gradient-to-r from-[var(--ai-cyan)] to-primary bg-clip-text text-transparent"
            >
              sound
            </motion.span>
            <motion.span
              variants={word}
              className="mr-3 inline-block bg-gradient-to-r from-[var(--ai-cyan)] to-primary bg-clip-text text-transparent"
            >
              human.
            </motion.span>
          </motion.h1>
>>>>>>> 1381d76d59ff11bc4f695c233c035fb979dd943b

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mx-auto mt-6 max-w-xl text-pretty text-base font-light leading-relaxed text-muted-foreground"
        >
          Build, launch, and scale voice agents on a self-hosted control panel. Native audio, real interruptions, and
          your own phone numbers — production-ready in an afternoon.
        </motion.p>

<<<<<<< HEAD
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.95 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <div className="group/btn relative overflow-hidden rounded-full">
            <Button
              size="lg"
              className="group relative h-12 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-7 text-white shadow-[0_10px_30px_-10px_var(--primary)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-12px_var(--primary)]"
=======
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-6 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
          >
            <Button
              size="lg"
              className="group btn-ai relative h-12 w-full overflow-hidden rounded-full px-7 text-primary-foreground shadow-[0_8px_30px_rgba(45,152,241,0.25)] transition-all sm:w-auto"
>>>>>>> 1381d76d59ff11bc4f695c233c035fb979dd943b
            >
              <span className="relative z-10">Build your first agent</span>
              <ArrowRight
                className="relative z-10 ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Button>
<<<<<<< HEAD
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-140%", "340%"] }}
              transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3, ease: "easeInOut" }}
            />
          </div>
          <Button
            size="lg"
            variant="outline"
            onPointerEnter={playHoverAudio}
            className="group h-12 rounded-full border-white/15 bg-white/[0.03] px-7 backdrop-blur-md hover:border-primary/50 hover:bg-white/[0.06]"
          >
            <PhoneCall className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" aria-hidden="true" />
            Try the live demo
          </Button>
=======
            <Button
              size="lg"
              variant="outline"
              className="group h-12 w-full rounded-full border-border/70 bg-card/30 px-7 text-foreground backdrop-blur-md hover:border-primary/50 hover:bg-card/50 hover:text-foreground sm:w-auto"
            >
              <PhoneCall className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" aria-hidden="true" />
              Try the live demo
            </Button>
          </motion.div>

          {/* Trust stats — the numbers used to just appear fully formed
              while everything else in the hero animates in. `<300ms` now
              counts up from 0 on mount (AnimatedNumber above); the other two
              aren't real numbers to count, so they get a matching pop-in
              (blur + scale settling into place) timed to land together,
              rather than sitting there static next to a counting neighbour. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.25 }}
            className="mt-8 grid grid-cols-3 gap-2 border-t border-border/40 pt-5 sm:flex sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-3 sm:border-0 sm:pt-0"
          >
            <div className="flex min-h-[84px] flex-col items-center justify-center gap-1 rounded-2xl border border-border/50 bg-gradient-to-b from-card/60 to-card/25 px-2 py-3 text-center shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] backdrop-blur-sm sm:block sm:min-h-0 sm:rounded-none sm:border-0 sm:bg-none sm:p-0 sm:text-left sm:shadow-none">
              <p className="text-[15px] font-semibold leading-tight tracking-tight text-primary sm:text-2xl">
                &lt;<AnimatedNumber target={300} delay={1.35} />ms
              </p>
              <p className="text-[8px] uppercase leading-snug tracking-wide text-muted-foreground/90 sm:mt-0.5 sm:text-xs sm:tracking-widest">
                Sub-second latency
              </p>
            </div>
            <div className="hidden h-10 w-px bg-border/60 sm:block" />
            <div className="flex min-h-[84px] flex-col items-center justify-center gap-1 rounded-2xl border border-border/50 bg-gradient-to-b from-card/60 to-card/25 px-2 py-3 text-center shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] backdrop-blur-sm sm:block sm:min-h-0 sm:rounded-none sm:border-0 sm:bg-none sm:p-0 sm:text-left sm:shadow-none">
              <motion.p
                initial={reduced ? false : { opacity: 0, scale: 0.85, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: 1.55, ease: [0.22, 1, 0.36, 1] }}
                className="text-[15px] font-semibold leading-tight tracking-tight text-primary sm:text-2xl"
              >
                Self-hosted
              </motion.p>
              <p className="text-[8px] uppercase leading-snug tracking-wide text-muted-foreground/90 sm:mt-0.5 sm:text-xs sm:tracking-widest">
                Your data, your stack
              </p>
            </div>
            <div className="hidden h-10 w-px bg-border/60 sm:block" />
            <div className="flex min-h-[84px] flex-col items-center justify-center gap-1 rounded-2xl border border-border/50 bg-gradient-to-b from-card/60 to-card/25 px-2 py-3 text-center shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] backdrop-blur-sm sm:block sm:min-h-0 sm:rounded-none sm:border-0 sm:bg-none sm:p-0 sm:text-left sm:shadow-none">
              <motion.p
                initial={reduced ? false : { opacity: 0, scale: 0.85, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: 1.75, ease: [0.22, 1, 0.36, 1] }}
                className="text-[15px] font-semibold leading-tight tracking-tight text-primary sm:text-2xl"
              >
                Unlimited
              </motion.p>
              <p className="text-[8px] uppercase leading-snug tracking-wide text-muted-foreground/90 sm:mt-0.5 sm:text-xs sm:tracking-widest">
                Concurrent calls
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Living Voice Operations Core */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50, rotate: 1 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:col-span-5"
        >
          <VoiceOperationsCore reduced={reduced} />
>>>>>>> 1381d76d59ff11bc4f695c233c035fb979dd943b
        </motion.div>

        {/* Centerpiece: circular voice orb visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 md:mt-20"
        >
          <HeroVoiceOrb />
        </motion.div>

        {/* Trust stats — inline ticker under the orb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mx-auto mt-2 flex max-w-md flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-6"
        >
          <div>
            <p className="text-xl font-semibold tracking-tight text-primary">&lt;300ms</p>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Sub-second latency</p>
          </div>
          <div className="hidden h-8 w-px bg-white/10 sm:block" />
          <div>
            <p className="text-xl font-semibold tracking-tight text-primary">Self-hosted</p>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Your data, your stack</p>
          </div>
          <div className="hidden h-8 w-px bg-white/10 sm:block" />
          <div>
            <p className="text-xl font-semibold tracking-tight text-primary">Unlimited</p>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Concurrent calls</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Carrier trust strip — was a flat two-line paragraph stack under a
          plain border-t, easy to mistake for stray leftover text rather than
          a deliberate section. Given the pill + gradient-line treatment used
          elsewhere on the page, plus a row of feature chips so "your
          numbers, your billing, unchanged" reads as three scannable claims
          instead of one long sentence. */}
      <motion.div
<<<<<<< HEAD
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.3 }}
        className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-black/50 py-5"
      >
        <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Connect your carrier account in two clicks
        </p>
        <p className="mx-auto max-w-2xl px-4 text-center text-sm leading-relaxed text-muted-foreground/90">
          Phone numbers, SIP trunks, and inbound routing flow through the carrier you already know and trust — your
          numbers, your billing, unchanged.
        </p>
=======
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="relative overflow-hidden bg-background/50 py-8 sm:py-10"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-32 w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[90px]"
        />

        <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 text-center">
          <span className="ai-pill-cyan">
            <Radio className="h-3 w-3" aria-hidden="true" />
            Connect your carrier account in two clicks
          </span>

          <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground/90">
            Phone numbers, SIP trunks, and inbound routing flow through the carrier you already know and trust.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {["Your numbers", "Your billing", "Zero downtime"].map((label) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-primary/70" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        </div>
>>>>>>> 1381d76d59ff11bc4f695c233c035fb979dd943b
      </motion.div>
    </section>
  )
}
