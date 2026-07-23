import Link from "next/link"
import { getCustomerList } from "@/lib/admin/queries"
import { formatDate, formatMoney, planLabel } from "@/lib/admin/format"

export const dynamic = "force-dynamic"

export default async function CustomersPage() {
  const customers = await getCustomerList()

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customers.length} {customers.length === 1 ? "account" : "accounts"} across all plans.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border/60">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-card/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Industry</th>
                <th className="px-4 py-3 font-medium text-right">Lifetime spend</th>
                <th className="px-4 py-3 font-medium text-right">Payments</th>
                <th className="px-4 py-3 font-medium text-right">DIDs</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-background/20">
              {customers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No customers yet. New signups will appear here automatically.
                  </td>
                </tr>
              )}
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-card/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="block">
                      <span className="font-medium text-foreground">{c.name || c.email}</span>
                      <span className="block text-xs text-muted-foreground">{c.email}</span>
                      {c.company && <span className="block text-xs text-muted-foreground">{c.company}</span>}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{planLabel(c.plan_id)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.industry || "—"}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatMoney(c.lifetime_paid_cents)}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{c.payments_count}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{c.phone_numbers_count}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
