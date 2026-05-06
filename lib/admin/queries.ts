import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"

export type Customer = {
  id: string
  email: string
  name: string | null
  company: string | null
  industry: string | null
  use_case: string | null
  plan_id: string | null
  plan_name: string | null
  stripe_customer_id: string | null
  created_at: string
}

export type Payment = {
  id: string
  customer_id: string | null
  kind: string
  plan_id: string | null
  amount_cents: number
  currency: string
  status: string
  description: string | null
  stripe_session_id: string | null
  stripe_payment_intent_id: string | null
  stripe_invoice_id: string | null
  created_at: string
}

export type PhoneNumber = {
  id: string
  customer_id: string
  region_id: string
  region_label: string
  monthly_cents: number
  quantity: number
  status: string
  stripe_subscription_id: string | null
  created_at: string
  canceled_at: string | null
}

export type CustomerListRow = Customer & {
  lifetime_paid_cents: number
  payments_count: number
  phone_numbers_count: number
}

const PLAN_PRIORITY: Record<string, number> = { scale: 0, growth: 1, starter: 2 }

// ---------------------------------------------------------------------------
// Overview metrics
// ---------------------------------------------------------------------------

export type Overview = {
  totalRevenueCents: number
  mrrCents: number
  customerCount: number
  paidCustomerCount: number
  activePhoneNumbers: number
  last30: { date: string; cents: number }[]
  planDistribution: { plan_id: string; count: number }[]
}

export async function getOverview(): Promise<Overview> {
  const supabase = createAdminClient()

  const [paymentsRes, customersRes, phonesRes] = await Promise.all([
    supabase
      .from("payments")
      .select("amount_cents, status, kind, created_at, customer_id")
      .order("created_at", { ascending: false }),
    supabase.from("customers").select("id, plan_id, created_at"),
    supabase
      .from("phone_numbers")
      .select("monthly_cents, quantity, status")
      .eq("status", "active"),
  ])

  const payments = (paymentsRes.data ?? []) as Array<
    Pick<Payment, "amount_cents" | "status" | "kind" | "created_at" | "customer_id">
  >
  const customers = (customersRes.data ?? []) as Array<{
    id: string
    plan_id: string | null
    created_at: string
  }>
  const phones = (phonesRes.data ?? []) as Array<
    Pick<PhoneNumber, "monthly_cents" | "quantity" | "status">
  >

  const paid = payments.filter((p) => p.status === "paid")
  const totalRevenueCents = paid.reduce((sum, p) => sum + (p.amount_cents ?? 0), 0)
  const paidCustomerIds = new Set(paid.map((p) => p.customer_id).filter(Boolean) as string[])

  const mrrCents = phones.reduce(
    (sum, r) => sum + (r.monthly_cents ?? 0) * (r.quantity ?? 1),
    0,
  )

  const planMap = new Map<string, number>()
  for (const c of customers) {
    if (!c.plan_id) continue
    planMap.set(c.plan_id, (planMap.get(c.plan_id) ?? 0) + 1)
  }
  const planDistribution = Array.from(planMap.entries())
    .map(([plan_id, count]) => ({ plan_id, count }))
    .sort((a, b) => (PLAN_PRIORITY[a.plan_id] ?? 9) - (PLAN_PRIORITY[b.plan_id] ?? 9))

  // Last 30 days revenue series.
  const days: { date: string; cents: number }[] = []
  const now = new Date()
  const dayMs = 86_400_000
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * dayMs)
    const key = d.toISOString().slice(0, 10)
    days.push({ date: key, cents: 0 })
  }
  const indexByDate = new Map(days.map((d, i) => [d.date, i]))
  for (const p of paid) {
    const key = (p.created_at ?? "").slice(0, 10)
    const idx = indexByDate.get(key)
    if (idx !== undefined) days[idx].cents += p.amount_cents ?? 0
  }

  return {
    totalRevenueCents,
    mrrCents,
    customerCount: customers.length,
    paidCustomerCount: paidCustomerIds.size,
    activePhoneNumbers: phones.reduce((s, r) => s + (r.quantity ?? 1), 0),
    last30: days,
    planDistribution,
  }
}

// ---------------------------------------------------------------------------
// Customer list (with lifetime spend)
// ---------------------------------------------------------------------------

export async function getCustomerList(): Promise<CustomerListRow[]> {
  const supabase = createAdminClient()
  const [{ data: customers }, { data: payments }, { data: phones }] = await Promise.all([
    supabase.from("customers").select("*").order("created_at", { ascending: false }),
    supabase.from("payments").select("customer_id, amount_cents, status"),
    supabase.from("phone_numbers").select("customer_id, status"),
  ])

  const spendByCust = new Map<string, { cents: number; count: number }>()
  for (const p of (payments ?? []) as Array<Pick<Payment, "customer_id" | "amount_cents" | "status">>) {
    if (!p.customer_id) continue
    const cur = spendByCust.get(p.customer_id) ?? { cents: 0, count: 0 }
    cur.count += 1
    if (p.status === "paid") cur.cents += p.amount_cents ?? 0
    spendByCust.set(p.customer_id, cur)
  }
  const phoneCountByCust = new Map<string, number>()
  for (const r of (phones ?? []) as Array<Pick<PhoneNumber, "customer_id" | "status">>) {
    if (!r.customer_id || r.status !== "active") continue
    phoneCountByCust.set(r.customer_id, (phoneCountByCust.get(r.customer_id) ?? 0) + 1)
  }

  return ((customers ?? []) as Customer[]).map((c) => ({
    ...c,
    lifetime_paid_cents: spendByCust.get(c.id)?.cents ?? 0,
    payments_count: spendByCust.get(c.id)?.count ?? 0,
    phone_numbers_count: phoneCountByCust.get(c.id) ?? 0,
  }))
}

// ---------------------------------------------------------------------------
// Payments feed
// ---------------------------------------------------------------------------

export type PaymentRow = Payment & {
  customer_email: string | null
  customer_name: string | null
}

export async function getRecentPayments(limit = 100): Promise<PaymentRow[]> {
  const supabase = createAdminClient()
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  const rows = (payments ?? []) as Payment[]
  const ids = Array.from(new Set(rows.map((r) => r.customer_id).filter(Boolean) as string[]))
  if (!ids.length) return rows.map((r) => ({ ...r, customer_email: null, customer_name: null }))

  const { data: customers } = await supabase
    .from("customers")
    .select("id, email, name")
    .in("id", ids)
  const byId = new Map(((customers ?? []) as Array<Pick<Customer, "id" | "email" | "name">>).map((c) => [c.id, c]))

  return rows.map((r) => ({
    ...r,
    customer_email: r.customer_id ? byId.get(r.customer_id)?.email ?? null : null,
    customer_name: r.customer_id ? byId.get(r.customer_id)?.name ?? null : null,
  }))
}

// ---------------------------------------------------------------------------
// Phone numbers feed
// ---------------------------------------------------------------------------

export type PhoneNumberRow = PhoneNumber & {
  customer_email: string | null
  customer_name: string | null
}

export async function getPhoneNumbers(): Promise<PhoneNumberRow[]> {
  const supabase = createAdminClient()
  const { data: phones } = await supabase
    .from("phone_numbers")
    .select("*")
    .order("created_at", { ascending: false })
  const rows = (phones ?? []) as PhoneNumber[]
  const ids = Array.from(new Set(rows.map((r) => r.customer_id)))
  if (!ids.length) return rows.map((r) => ({ ...r, customer_email: null, customer_name: null }))
  const { data: customers } = await supabase
    .from("customers")
    .select("id, email, name")
    .in("id", ids)
  const byId = new Map(((customers ?? []) as Array<Pick<Customer, "id" | "email" | "name">>).map((c) => [c.id, c]))
  return rows.map((r) => ({
    ...r,
    customer_email: byId.get(r.customer_id)?.email ?? null,
    customer_name: byId.get(r.customer_id)?.name ?? null,
  }))
}

// ---------------------------------------------------------------------------
// Single customer detail
// ---------------------------------------------------------------------------

export type CustomerDetail = {
  customer: Customer
  payments: Payment[]
  phone_numbers: PhoneNumber[]
  lifetime_paid_cents: number
}

export async function getCustomer(id: string): Promise<CustomerDetail | null> {
  const supabase = createAdminClient()
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .maybeSingle()
  if (!customer) return null
  const [{ data: payments }, { data: phones }] = await Promise.all([
    supabase.from("payments").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
    supabase.from("phone_numbers").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
  ])
  const ps = (payments ?? []) as Payment[]
  return {
    customer: customer as Customer,
    payments: ps,
    phone_numbers: (phones ?? []) as PhoneNumber[],
    lifetime_paid_cents: ps.filter((p) => p.status === "paid").reduce((s, p) => s + (p.amount_cents ?? 0), 0),
  }
}
