"use client"

// Marketing /pricing plan grid. Fetches the SAME live plans the get-started
// signup widget uses (https://voice.9278.ai/api/plans), so any pricing update
// in the portal is reflected here automatically. Each card deep-links into
// /get-started?plan=<id>&cycle=<cycle>, where checkout is completed.

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Check, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
      <div className="grid gap-5 md:grid-cols-3 md:items-stretch">
        {ordered.map((p) => {
          const price = priceFor(p)
          const featured = Boolean(p.tag)
          return (
            <Card
              key={p.id}
              className={cn(
                "relative flex flex-col transition",
                featured ? "border-primary ring-1 ring-primary/30" : "",
              )}
            >
              {p.tag && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary hover:bg-primary">
                  {p.tag}
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{p.label}</CardTitle>
                <p className="text-sm text-muted-foreground">{p.sub}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <div className="mb-1">
                  <span className="text-4xl font-bold tracking-tight">{usd(price)}</span>
                  <span className="ml-1 text-sm text-muted-foreground">/{cycle === "yearly" ? "yr" : "mo"}</span>
                </div>
                {cycle === "yearly" && (
                  <div className="mb-2 text-xs text-primary">Save {usd(yearlySavings(p))} vs monthly</div>
                )}
                <div className="mb-4 text-xs text-muted-foreground">
                  {p.min.toLocaleString("en-US")} min · {usd(p.rate)}/min ·{" "}
                  {p.agents >= 999 ? "Unlimited" : `${p.agents} agents`}
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  {p.perks
                    .filter((perk) => !/phone number|concurrent call/i.test(perk))
                    .map((perk) => (
                      <li key={perk} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{perk}</span>
                      </li>
                    ))}
                </ul>
                <Button
                  asChild
                  size="lg"
                  variant={featured ? "default" : "outline"}
                  className={cn("mt-auto w-full rounded-full", featured && "btn-ai text-primary-foreground")}
                >
                  <Link href={`/get-started?plan=${p.id}&cycle=${cycle}`}>
                    {featured ? `Choose ${p.label}` : "Get started"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        All plans include real-time transcripts, recording, analytics, and unlimited test calls in the playground.
      </p>
    </div>
  )
}
