import Link from "next/link"
import { getPhoneNumbers } from "@/lib/admin/queries"
import { formatDate, formatMoney } from "@/lib/admin/format"
import { StatusBadge } from "@/components/admin/status-badge"

export const dynamic = "force-dynamic"

export default async function PhoneNumbersPage() {
  const phones = await getPhoneNumbers()
  const totalMrr = phones
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.monthly_cents * p.quantity, 0)

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Phone numbers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All provisioned DIDs across customers, regions and statuses.
          </p>
        </div>
        <div className="rounded-md border border-border/60 bg-card/40 px-4 py-2 text-right">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Active MRR</p>
          <p className="text-lg font-semibold tracking-tight">{formatMoney(totalMrr)}</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border/60">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-card/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Region</th>
                <th className="px-4 py-3 font-medium text-right">Qty</th>
                <th className="px-4 py-3 font-medium text-right">Monthly</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Provisioned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-background/20">
              {phones.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No phone numbers provisioned yet.
                  </td>
                </tr>
              )}
              {phones.map((n) => (
                <tr key={n.id} className="hover:bg-card/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${n.customer_id}`} className="hover:underline">
                      {n.customer_name || n.customer_email || "Customer"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{n.region_label}</td>
                  <td className="px-4 py-3 text-right">{n.quantity}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatMoney(n.monthly_cents * n.quantity)}
                    <span className="ml-1 text-xs text-muted-foreground">/ mo</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={n.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(n.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
