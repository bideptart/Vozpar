import "server-only"

import Stripe from "stripe"

let _stripe: Stripe | null = null

/**
 * Lazily resolves the Stripe client. We avoid instantiating at module-load
 * so that pages which merely import this file don't crash during
 * `next build` page-data collection when STRIPE_SECRET_KEY isn't set.
 */
export function getStripe(): Stripe {
  if (_stripe) return _stripe
  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured. Connect the Stripe integration in the v0 sidebar to enable checkout.",
    )
  }
  _stripe = new Stripe(apiKey)
  return _stripe
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}
