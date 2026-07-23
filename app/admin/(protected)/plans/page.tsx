import { getOverview } from "@/lib/admin/queries"
import { PLANS } from "@/lib/pricing"
import { formatMoney, planLabel } from "@/lib/admin/format"

export const dynamic = "force-dynamic"

export default async function PlanDistributionPage() {
  const overview = await getOverview()
  const total = overview.planDistribution.reduce((s, r) => s + r.count, 0)

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Plan distribution</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Customer counts and conversion rate per credit tier.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const count = overview.planDistribution.find((r) => r.plan_id === plan.id)?.count ?? 0
          const share = total === 0 ? 0 : Math.round((count / total) * 100)
          return (
            <div key={plan.id} className="rounded-lg border border-border/60 bg-card/40 p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{planLabel(plan.id)}</p>
                <p className="text-xs text-muted-foreground">${plan.amount} · ${plan.ratePerMin.toFixed(2)}/min</p>
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight">{count}</p>
              <p className="mt-1 text-xs text-muted-foreground">{share}% of paying customers</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-background/40">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.min(100, share)}%` }}
                  aria-hidden
                />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Estimated revenue captured:{" "}
                <span className="text-foreground">{formatMoney(count * plan.amount * 100)}</span>
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
