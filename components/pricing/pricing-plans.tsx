"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import Link from "next/link"
import { Check, Loader2 } from "lucide-react"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const PORTAL_BASE = "https://voice.9278.ai"

function TypewriterPrice({ value, suffix }: { value: string; suffix: string }) {
  const [displayText, setDisplayText] = useState(value)
  const [isTyping, setIsTyping] = useState(false)

  const startTypewriter = (targetVal?: string) => {
    const textToType = targetVal ?? value
    setIsTyping(true)
    setDisplayText("")
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayText(textToType.slice(0, i))
      if (i >= textToType.length) {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, 70)
  }

  useEffect(() => {
    startTypewriter(value)
  }, [value])

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        startTypewriter()
      }}
      className="inline-flex items-baseline gap-1 cursor-pointer select-none group/price hover:opacity-90"
      title="Click to replay typewriter effect"
    >
      <span className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-white transition-colors group-hover/price:text-sky-300">
        {displayText}
        {isTyping && <span className="animate-pulse text-sky-400 font-normal ml-0.5">|</span>}
      </span>
      <span className="font-sans text-xs text-slate-400">{suffix}</span>
    </div>
  )
}

type Plan = {
  id: string
  label: string
  amount: number
  yearlyAmount: number
  yearlySavingsUsd?: number
  min: number
  rate: number
  agents: number
  tag: string | null
  sub: string
  perks: string[]
}

const usd = (n: number) =>
  "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })

function PricingTiltCard({
  children,
  featured,
}: {
  children: React.ReactNode
  featured: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)

  const springCfg = { stiffness: 180, damping: 22, mass: 0.4 }
  const sx = useSpring(nx, springCfg)
  const sy = useSpring(ny, springCfg)

  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6])

  const mx = useSpring(mouseX, springCfg)
  const my = useSpring(mouseY, springCfg)

  const spotlightColor = featured
    ? "color-mix(in oklch, var(--primary) 24%, transparent)"
    : "color-mix(in oklch, var(--accent) 15%, transparent)"

  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${mx}px ${my}px, ${spotlightColor}, transparent 70%)`

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouseX.set(x)
    mouseY.set(y)
    nx.set(x / rect.width - 0.5)
    ny.set(y / rect.height - 0.5)
  }

  function handleLeave() {
    nx.set(0)
    ny.set(0)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border bg-[#08080a] p-5 sm:p-6 transition-colors duration-300",
        featured
          ? "border-primary ring-1 ring-primary/40 shadow-[0_12px_45px_-12px_rgba(4,107,210,0.4)]"
          : "border-white/10 hover:border-primary/30"
      )}
    >
      {/* 3D Spotlight */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight, transform: "translateZ(10px)" }}
      />

      {/* Internal border glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 border border-primary/20 transition-opacity duration-300 group-hover:opacity-100"
        style={{ transform: "translateZ(5px)" }}
      />

      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="relative flex flex-1 flex-col h-full">
        {children}
      </div>
    </motion.div>
  )
}

const DEFAULT_PLANS: Plan[] = [
  {
    id: "starter",
    label: "Starter",
    amount: 31,
    yearlyAmount: 298,
    min: 250,
    rate: 0.13,
    agents: 2,
    tag: null,
    sub: "Pilot a single agent and prove the ROI.",
    perks: [
      "250 included minutes / mo",
      "$0.13/min per-second voice rate",
      "2 concurrent AI agents",
      "1 US/CA local phone number included",
      "Real-time transcript & call logs",
      "Standard email support",
    ],
  },
  {
    id: "growth",
    label: "Growth",
    amount: 93,
    yearlyAmount: 893,
    min: 800,
    rate: 0.12,
    agents: 10,
    tag: "Most Popular",
    sub: "Most teams start here. Scale to a full pipeline.",
    perks: [
      "800 included minutes / mo",
      "$0.12/min per-second voice rate",
      "10 concurrent AI agents",
      "1 US/CA local phone number included",
      "Real-time transcript & call logs",
      "Priority email & chat support",
      "Custom webhooks & integrations",
    ],
  },
  {
    id: "scale",
    label: "Scale",
    amount: 316,
    yearlyAmount: 3034,
    min: 3000,
    rate: 0.11,
    agents: 999,
    tag: null,
    sub: "High-volume teams running full call centers.",
    perks: [
      "3,000 included minutes / mo",
      "$0.11/min per-second voice rate",
      "Unlimited AI agents",
      "1 US/CA local phone number included",
      "Real-time transcript & call logs",
      "24/7 dedicated support & SLA",
      "Custom webhooks & integrations",
      "Custom voice cloning & fine-tuning",
    ],
  },
]

export function PricingPlans() {
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS)
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly")

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3000)

    fetch(`${PORTAL_BASE}/api/plans`, { signal: controller.signal })
      .then((r) => r.json())
      .then((res) => {
        clearTimeout(timer)
        if (!cancelled && res && Array.isArray(res.plans) && res.plans.length > 0) {
          setPlans(res.plans)
        }
      })
      .catch(() => {
        clearTimeout(timer)
      })

    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
  }, [])

  const priceFor = (p: Plan) => (cycle === "yearly" ? p.yearlyAmount : p.amount)
  const yearlySavings = (p: Plan) => p.yearlySavingsUsd ?? Math.max(0, p.amount * 12 - p.yearlyAmount)

  const ordered = useMemo(() => plans, [plans])

  return (
    <div suppressHydrationWarning>
      {/* Billing cycle toggle */}
      <div className="mb-5 flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.04] p-1.5 text-sm backdrop-blur-xl shadow-lg">
          <button
            type="button"
            onClick={() => setCycle("monthly")}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
              cycle === "monthly" ? "bg-white text-black shadow-md" : "text-slate-400 hover:text-white",
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setCycle("yearly")}
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
              cycle === "yearly" ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(4,107,210,0.4)]" : "text-slate-400 hover:text-white",
            )}
          >
            Yearly
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                cycle === "yearly" ? "bg-white/20 text-white" : "bg-primary/20 text-primary",
              )}
            >
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Per-second billing callout */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/[0.08] px-5 py-2.5 text-xs sm:text-sm text-primary backdrop-blur-md shadow-[0_0_20px_rgba(4,107,210,0.15)]">
          <span className="text-base">⏱️</span>
          <span>
            <strong className="text-white">Per-second billing</strong> — pay only for the seconds you use.
          </span>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid gap-6 md:grid-cols-3 md:items-stretch">
        {ordered.map((p) => {
          const price = priceFor(p)
          const featured = Boolean(p.tag)
          const visiblePerks = p.perks.filter((perk) => !/phone number|concurrent call/i.test(perk))
          return (
            <PricingTiltCard key={p.id} featured={featured}>
              {p.tag && (
                <Badge 
                  className="absolute -top-3 left-1/2 bg-primary hover:bg-primary select-none z-10 font-sans text-[10px] font-bold uppercase tracking-wider shadow-[0_4px_14px_rgba(4,107,210,0.4)]"
                  style={{ transform: "translateZ(45px) translateX(-50%)" }}
                >
                  {p.tag}
                </Badge>
              )}

              {/* Title & Subtitle */}
              <div
                style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }}
                className="flex flex-col gap-0.5 pb-2"
              >
                <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-white">{p.label}</h3>
                <p className="min-h-[1.5rem] font-sans text-xs text-slate-400">{p.sub}</p>
              </div>

              <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="flex flex-1 flex-col justify-between pt-1">
                <div>
                  {/* Price Block with Typewriter Effect */}
                  <div style={{ transform: "translateZ(40px)" }}>
                    <TypewriterPrice
                      value={usd(price)}
                      suffix={`/${cycle === "yearly" ? "yr" : "mo"}`}
                    />
                  </div>

                  {/* Yearly savings tag / Spacer */}
                  <div className="min-h-[1rem] mt-0.5">
                    {cycle === "yearly" ? (
                      <div
                        style={{ transform: "translateZ(30px)" }}
                        className="font-sans text-[11px] font-semibold text-primary"
                      >
                        Save {usd(yearlySavings(p))} vs monthly
                      </div>
                    ) : null}
                  </div>

                  {/* Subtext info */}
                  <div
                    style={{ transform: "translateZ(25px)" }}
                    className="mt-1 mb-3 font-sans text-[11px] font-medium text-slate-400"
                  >
                    {p.min.toLocaleString("en-US")} min · {usd(p.rate)}/min ·{" "}
                    {p.agents >= 999 ? "Unlimited" : `${p.agents} agents`}
                  </div>

                  {/* Perks List */}
                  <ul
                    style={{ transform: "translateZ(22px)" }}
                    className="space-y-1.5 font-sans text-xs text-slate-300 mb-4"
                  >
                    {visiblePerks.map((perk) => (
                      <li key={perk} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="leading-tight text-slate-200">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* CTA Button - Always inside the card box */}
                <div style={{ transform: "translateZ(30px)" }} className="mt-auto pt-2 w-full">
                  {featured ? (
                    <div className="relative w-full overflow-hidden rounded-full group/btn">
                      <Button
                        asChild
                        size="sm"
                        className="h-10 w-full rounded-full bg-gradient-to-r from-primary to-sky-400 font-sans text-xs sm:text-sm font-semibold text-primary-foreground shadow-[0_4px_16px_rgba(4,107,210,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_6px_22px_rgba(4,107,210,0.6)]"
                      >
                        <Link href={`/get-started?plan=${p.id}&cycle=${cycle}`}>
                          Choose {p.label}
                        </Link>
                      </Button>
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ["-140%", "340%"] }}
                        transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3.5, ease: "easeInOut" }}
                      />
                    </div>
                  ) : (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-10 w-full rounded-full border-white/15 bg-white/[0.03] font-sans text-xs sm:text-sm font-semibold text-white transition-all hover:border-primary/50 hover:bg-white/10 hover:text-white"
                    >
                      <Link href={`/get-started?plan=${p.id}&cycle=${cycle}`}>
                        Get started
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </PricingTiltCard>
          )
        })}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        All plans include real-time transcripts, recording, analytics, and unlimited test calls in the playground.
      </p>
    </div>
  )
}
