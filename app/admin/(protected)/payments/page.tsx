import Link from "next/link"
import { getRecentPayments } from "@/lib/admin/queries"
import { formatDateTime, formatMoney } from "@/lib/admin/format"
import { StatusBadge } from "@/components/admin/status-badge"

export const dynamic = "force-dynamic"

export default async function PaymentsPage() {
  const payments = await getRecentPayments(200)

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Latest charges, refunds and failures across all customers.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border/60">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-card/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Kind</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-background/20">
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No payments yet. Successful Stripe checkouts will land here automatically.
                  </td>
                </tr>
              )}
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-card/30">
                  <td className="px-4 py-3 text-muted-foreground">{formatDateTime(p.created_at)}</td>
                  <td className="px-4 py-3">
                    {p.customer_id ? (
                      <Link href={`/admin/customers/${p.customer_id}`} className="hover:underline">
                        {p.customer_name || p.customer_email || "Customer"}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.description || "—"}</td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{p.kind.replace("_", " ")}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatMoney(p.amount_cents, p.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
