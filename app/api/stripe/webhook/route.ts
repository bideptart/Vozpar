import { NextResponse, type NextRequest } from "next/server"
import type Stripe from "stripe"
import { getStripe, isStripeConfigured } from "@/lib/stripe"
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin"
import { PLANS, PHONE_NUMBER_RATES, type PlanId } from "@/lib/pricing"

export const runtime = "nodejs"
// Stripe must verify the raw body — do not parse.
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const sig = req.headers.get("stripe-signature")

  if (!isStripeConfigured() || !secret || !sig) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 })
  }

  const stripe = getStripe()
  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature"
    return NextResponse.json({ error: `Webhook signature failed: ${message}` }, { status: 400 })
  }

  if (!isSupabaseAdminConfigured()) {
    // Acknowledge so Stripe stops retrying, but log the misconfiguration.
    console.error("[v0] Stripe webhook received but Supabase admin not configured")
    return NextResponse.json({ received: true, persisted: false })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object)
        break
      case "invoice.paid":
        await handleInvoicePaid(event.data.object)
        break
      case "invoice.payment_failed":
        await handleInvoiceFailed(event.data.object)
        break
      case "charge.refunded":
        await handleChargeRefunded(event.data.object)
        break
      default:
        // Ignore other event types.
        break
    }
  } catch (err) {
    console.error("[v0] Webhook handler error:", err)
    return NextResponse.json({ error: "handler_error" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient()
  const md = (session.metadata ?? {}) as Record<string, string>

  const planId = (md.planId || "") as PlanId
  const plan = PLANS.find((p) => p.id === planId)
  const email =
    session.customer_details?.email ??
    (typeof session.customer_email === "string" ? session.customer_email : null)
  if (!email) return

  // 1) Upsert customer row (keyed on email).
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .upsert(
      {
        email,
        name: md.name || session.customer_details?.name || null,
        company: md.company || null,
        industry: md.industry || null,
        use_case: md.useCase || null,
        plan_id: plan?.id ?? null,
        plan_name: plan?.name ?? null,
        stripe_customer_id:
          typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
      },
      { onConflict: "email" },
    )
    .select("id")
    .single()

  if (customerError || !customer) {
    console.error("[v0] customers upsert failed", customerError)
    return
  }

  // 2) Insert plan_credit payment row.
  if (plan) {
    await supabase.from("payments").upsert(
      {
        customer_id: customer.id,
        stripe_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null,
        kind: "plan_credit",
        plan_id: plan.id,
        amount_cents: plan.amount * 100,
        currency: (session.currency ?? "usd").toLowerCase(),
        status: session.payment_status === "paid" || session.status === "complete" ? "paid" : "pending",
        description: `${plan.name} credit · ${plan.minutes.toLocaleString()} min`,
      },
      { onConflict: "stripe_session_id" },
    )
  }

  // 3) Insert phone-number row(s).
  const regionId = md.phoneRegionId
  const region = PHONE_NUMBER_RATES.find((r) => r.id === regionId)
  const qty = Math.max(0, Number(md.phoneQty || 0))
  if (region && qty > 0) {
    await supabase.from("phone_numbers").insert({
      customer_id: customer.id,
      region_id: region.id,
      region_label: region.region,
      monthly_cents: region.monthly * 100,
      quantity: qty,
      stripe_subscription_id:
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id ?? null,
      status: "active",
    })
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const supabase = createAdminClient()
  const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id
  if (!customerId) return

  // Find the local customer by Stripe customer id.
  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle()
  if (!customer) return

  await supabase.from("payments").insert({
    customer_id: customer.id,
    stripe_invoice_id: invoice.id,
    kind: "phone_number",
    amount_cents: invoice.amount_paid ?? 0,
    currency: (invoice.currency ?? "usd").toLowerCase(),
    status: "paid",
    description: invoice.description ?? "Phone number monthly fee",
  })
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const supabase = createAdminClient()
  const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id
  if (!customerId) return
  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle()
  if (!customer) return
  await supabase.from("payments").insert({
    customer_id: customer.id,
    stripe_invoice_id: invoice.id,
    kind: "phone_number",
    amount_cents: invoice.amount_due ?? 0,
    currency: (invoice.currency ?? "usd").toLowerCase(),
    status: "failed",
    description: "Phone number invoice failed",
  })
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const supabase = createAdminClient()
  const piId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id
  if (!piId) return
  await supabase
    .from("payments")
    .update({ status: "refunded" })
    .eq("stripe_payment_intent_id", piId)
}
