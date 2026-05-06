"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getStripe } from "@/lib/stripe"
import {
  PLANS,
  PHONE_NUMBER_RATES,
  type PlanId,
  type PhoneNumberRegion,
} from "@/lib/pricing"

type RegionId = PhoneNumberRegion["id"]

export type StartCheckoutInput = {
  planId: PlanId
  /** Optional phone number region id; "none" or undefined skips DID. */
  phoneRegionId?: RegionId | "none"
  /** Quantity of phone numbers (only used when a region is selected). */
  phoneQty?: number
  /** Captured customer details from /get-started; optional from /pricing. */
  customer?: {
    name?: string
    email?: string
    company?: string
    phone?: string
    industry?: string
    useCase?: string
  }
}

async function originUrl() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https")
  return `${proto}://${host}`
}

/**
 * Server action: creates a Stripe Checkout Session for the chosen plan and
 * (optionally) a recurring phone-number subscription, then 303-redirects the
 * browser to the Stripe-hosted payment page.
 *
 * Used by:
 *  - /pricing  — "Buy now" buttons on each plan card (plan only)
 *  - /get-started — full form submission (plan + DID + customer details)
 */
export async function startCheckout(input: StartCheckoutInput): Promise<never> {
  const plan = PLANS.find((p) => p.id === input.planId)
  if (!plan) {
    throw new Error(`Unknown plan: ${input.planId}`)
  }

  const region =
    input.phoneRegionId && input.phoneRegionId !== "none"
      ? PHONE_NUMBER_RATES.find((r) => r.id === input.phoneRegionId)
      : undefined

  const qty = Math.max(1, Math.min(50, Number(input.phoneQty || 1)))

  const origin = await originUrl()

  const stripe = getStripe()

  // Plan credit — one-time
  const items: Parameters<typeof stripe.checkout.sessions.create>[0]["line_items"] = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: `9278.ai ${plan.name} credit`,
          description: `$${plan.amount} voice credit · ${plan.minutes.toLocaleString()} minutes at $${plan.ratePerMin.toFixed(
            2,
          )}/min · ${plan.agents} concurrent AI agent${plan.agents > 1 ? "s" : ""} · valid 60 days`,
        },
        unit_amount: plan.amount * 100,
      },
      quantity: 1,
    },
  ]

  // Phone number — recurring monthly subscription
  if (region) {
    items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${region.region} phone number`,
          description: region.description,
        },
        unit_amount: region.monthly * 100,
        recurring: { interval: "month" },
      },
      quantity: qty,
    })
  }

  const mode: "payment" | "subscription" = region ? "subscription" : "payment"

  const session = await stripe.checkout.sessions.create({
    mode,
    line_items: items,
    customer_email: input.customer?.email,
    success_url: `${origin}/get-started/thanks?plan=${plan.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?canceled=1`,
    allow_promotion_codes: true,
    metadata: {
      planId: plan.id,
      phoneRegionId: region?.id ?? "none",
      phoneQty: region ? String(qty) : "0",
      industry: input.customer?.industry ?? "",
      company: input.customer?.company ?? "",
      name: input.customer?.name ?? "",
      contactPhone: input.customer?.phone ?? "",
      useCase: (input.customer?.useCase ?? "").slice(0, 480),
    },
  })

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL")
  }

  redirect(session.url)
}

/**
 * Thin wrapper for plain `<form action>` calls from a plan card.
 * Reads only the planId from FormData.
 */
export async function checkoutPlanAction(formData: FormData): Promise<void> {
  const planId = String(formData.get("planId") || "") as PlanId
  await startCheckout({ planId })
}
