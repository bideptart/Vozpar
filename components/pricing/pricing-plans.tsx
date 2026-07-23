"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import Link from "next/link"
import { Check, Loader2 } from "lucide-react"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const PORTAL_BASE = "https://voice.9278.ai"

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
        "group relative flex flex-col rounded-2xl border bg-[#08080a] p-7 transition-colors duration-300",
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

export function PricingPlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${PORTAL_BASE}/api/plans`).then((r) => r.json())
        if (!cancelled) setPlans(res.plans || [])
      } catch (e) {
        if (!cancelled) setLoadError((e as Error).message || "Could not load plans")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const priceFor = (p: Plan) => (cycle === "yearly" ? p.yearlyAmount : p.amount)
  const yearlySavings = (p: Plan) => p.yearlySavingsUsd ?? Math.max(0, p.amount * 12 - p.yearlyAmount)

  const ordered = useMemo(() => plans, [plans])

  if (loadError) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center text-sm text-destructive">
        Couldn&apos;t load live pricing ({loadError}). Please refresh, or{" "}
        <Link href="/contact" className="underline">
          contact us
        </Link>
        .
      </div>
    )
  }

  if (plans.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading live pricing…
      </div>
    )
  }

  return (
    <div>
      {/* Billing cycle toggle */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 text-sm">
          <button
            type="button"
            onClick={() => setCycle("monthly")}
            className={cn(
              "rounded-full px-4 py-1.5 transition",
              cycle === "monthly" ? "bg-foreground text-background" : "text-muted-foreground",
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setCycle("yearly")}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 transition",
              cycle === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            Yearly
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px]",
                cycle === "yearly" ? "bg-white/20 text-white" : "bg-primary/10 text-primary",
              )}
            >
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Per-second billing callout */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.06] px-4 py-2 text-sm text-primary">
          <span>⏱️</span>
          <span>
            <strong>Per-second billing</strong> — pay only for the seconds you use.
          </span>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid gap-5 md:grid-cols-3 md:items-stretch" style={{ perspective: "1200px" }}>
        {ordered.map((p) => {
          const price = priceFor(p)
          const featured = Boolean(p.tag)
          return (
            <PricingTiltCard key={p.id} featured={featured}>
              {p.tag && (
                <Badge 
                  className="absolute -top-3 left-1/2 bg-primary hover:bg-primary select-none z-10"
                  style={{ transform: "translateZ(45px) translateX(-50%)" }}
                >
                  {p.tag}
                </Badge>
              )}
              <div style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }} className="space-y-1.5 pb-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight text-white">{p.label}</h3>
                <p className="text-sm text-muted-foreground">{p.sub}</p>
              </div>
              <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="flex flex-1 flex-col">
                <div style={{ transform: "translateZ(40px)" }} className="mb-1">
                  <span className="text-4xl font-bold tracking-tight text-white">{usd(price)}</span>
                  <span className="ml-1 text-sm text-muted-foreground">/{cycle === "yearly" ? "yr" : "mo"}</span>
                </div>
                {cycle === "yearly" && (
                  <div style={{ transform: "translateZ(30px)" }} className="mb-2 text-xs text-primary font-medium">Save {usd(yearlySavings(p))} vs monthly</div>
                )}
                <div style={{ transform: "translateZ(25px)" }} className="mb-4 text-xs text-muted-foreground">
                  {p.min.toLocaleString("en-US")} min · {usd(p.rate)}/min ·{" "}
                  {p.agents >= 999 ? "Unlimited" : `${p.agents} agents`}
                </div>
                <ul style={{ transform: "translateZ(22px)" }} className="mb-6 space-y-2 text-sm flex-1">
                  {p.perks
                    .filter((perk) => !/phone number|concurrent call/i.test(perk))
                    .map((perk) => (
                      <li key={perk} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{perk}</span>
                      </li>
                    ))}
                </ul>
                
                {featured ? (
                  <div style={{ transform: "translateZ(35px)" }} className="relative mt-auto w-full overflow-hidden rounded-full group/btn">
                    <Button
                      asChild
                      size="lg"
                      className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_8px_24px_-8px_var(--primary)] transition-all hover:shadow-[0_12px_32px_-10px_var(--primary)] hover:scale-[1.02]"
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
                  <div style={{ transform: "translateZ(30px)" }} className="mt-auto w-full">
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full rounded-full border-white/10 hover:border-primary/40 hover:bg-white/[0.02]"
                    >
                      <Link href={`/get-started?plan=${p.id}&cycle=${cycle}`}>
                        Get started
                      </Link>
                    </Button>
                  </div>
                )}
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
