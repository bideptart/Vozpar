import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { getCustomer } from "@/lib/admin/queries"
import { formatDate, formatDateTime, formatMoney, planLabel } from "@/lib/admin/format"
import { StatusBadge } from "@/components/admin/status-badge"

export const dynamic = "force-dynamic"

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const detail = await getCustomer(id)
  if (!detail) notFound()
  const { customer, payments, phone_numbers, lifetime_paid_cents } = detail

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden /> All customers
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{customer.name || customer.email}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{customer.email}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Lifetime spend</p>
          <p className="text-2xl font-semibold tracking-tight">{formatMoney(lifetime_paid_cents)}</p>
        </div>
      </div>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Plan" value={planLabel(customer.plan_id)} />
        <Field label="Company" value={customer.company || "—"} />
        <Field label="Industry" value={customer.industry || "—"} />
        <Field label="Joined" value={formatDate(customer.created_at)} />
      </section>

      {customer.use_case && (
        <section className="mt-6 rounded-lg border border-border/60 bg-card/40 p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Use case</p>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{customer.use_case}</p>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Payments</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-border/60">
          <table className="min-w-full text-sm">
            <thead className="bg-card/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Kind</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-background/20">
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No payments yet.
                  </td>
                </tr>
              )}
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-muted-foreground">{formatDateTime(p.created_at)}</td>
                  <td className="px-4 py-3">{p.description || "—"}</td>
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
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Phone numbers</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-border/60">
          <table className="min-w-full text-sm">
            <thead className="bg-card/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Region</th>
                <th className="px-4 py-3 font-medium text-right">Quantity</th>
                <th className="px-4 py-3 font-medium text-right">Monthly</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Provisioned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-background/20">
              {phone_numbers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No phone numbers attached.
                  </td>
                </tr>
              )}
              {phone_numbers.map((n) => (
                <tr key={n.id}>
                  <td className="px-4 py-3">{n.region_label}</td>
                  <td className="px-4 py-3 text-right">{n.quantity}</td>
                  <td className="px-4 py-3 text-right">
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
      </section>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm">{value}</p>
    </div>
  )
}
