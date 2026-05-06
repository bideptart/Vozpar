import { getOverview } from "@/lib/admin/queries"
import { formatMoney } from "@/lib/admin/format"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { Users, DollarSign, Repeat, PhoneCall } from "lucide-react"
import { planLabel } from "@/lib/admin/format"

export const dynamic = "force-dynamic"

export default async function AdminOverviewPage() {
  const data = await getOverview()

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time revenue, MRR and account health for 9278.ai.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={DollarSign} label="Total revenue" value={formatMoney(data.totalRevenueCents)} sub="All paid charges" />
        <Stat icon={Repeat} label="MRR (phone numbers)" value={formatMoney(data.mrrCents)} sub="Active subscriptions" />
        <Stat
          icon={Users}
          label="Customers"
          value={String(data.customerCount)}
          sub={`${data.paidCustomerCount} have paid`}
        />
        <Stat icon={PhoneCall} label="Active DIDs" value={String(data.activePhoneNumbers)} sub="Numbers in service" />
      </div>

      <section className="mt-10 rounded-lg border border-border/60 bg-card/40 p-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Revenue · last 30 days</h2>
            <p className="text-sm text-muted-foreground">Sum of paid charges per day, in USD.</p>
          </div>
        </div>
        <div className="mt-6 h-64">
          <RevenueChart data={data.last30} />
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-border/60 bg-card/40 p-6">
        <h2 className="text-lg font-semibold tracking-tight">Plan distribution</h2>
        <p className="text-sm text-muted-foreground">Active customers grouped by their most recent plan.</p>
        {data.planDistribution.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">No paying customers yet.</p>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {data.planDistribution.map((row) => (
              <div key={row.plan_id} className="rounded-md border border-border/60 bg-background/40 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{planLabel(row.plan_id)}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{row.count}</p>
                <p className="text-xs text-muted-foreground">customers</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden />
        <p className="text-xs uppercase tracking-wider">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}
