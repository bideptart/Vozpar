"use server"

import { PLANS, PHONE_NUMBER_RATES, type PlanId, type PhoneNumberRegion } from "@/lib/pricing"
import { startCheckout } from "@/app/actions/checkout"

export type SignupState = {
  ok: boolean
  message?: string
  errors?: Partial<Record<string, string>>
}

const INDUSTRIES = [
  "real-estate",
  "dental",
  "healthcare",
  "home-services",
  "automotive",
  "legal",
  "restaurants",
  "ecommerce",
  "fitness",
  "other",
]

export async function submitSignup(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const planId = String(formData.get("plan") || "") as PlanId
  // The form posts the region.id ("us" | "ca" | "uk" | "eu") or "none"
  const phoneRegionId = String(formData.get("phoneRegion") || "none") as PhoneNumberRegion["id"] | "none"
  const phoneQty = Number(formData.get("phoneQty") || 0)
  const name = String(formData.get("name") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const company = String(formData.get("company") || "").trim()
  const phone = String(formData.get("phone") || "").trim()
  const industry = String(formData.get("industry") || "")
  const useCase = String(formData.get("useCase") || "").trim()

  const errors: Record<string, string> = {}
  const plan = PLANS.find((p) => p.id === planId)
  if (!plan) errors.plan = "Please choose a plan."
  if (!name) errors.name = "Tell us your name."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email."
  if (!company) errors.company = "Company name is required."
  if (industry && !INDUSTRIES.includes(industry)) errors.industry = "Pick an industry from the list."
  if (phoneRegionId !== "none" && !PHONE_NUMBER_RATES.find((r) => r.id === phoneRegionId)) {
    errors.phoneRegion = "Choose a valid region."
  }
  if (phoneRegionId !== "none" && (phoneQty < 1 || phoneQty > 50)) {
    errors.phoneQty = "Phone quantity must be between 1 and 50."
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please fix the highlighted fields.", errors }
  }

  // All valid — hand off to Stripe Checkout. startCheckout calls redirect() and
  // never returns, so anything after this is unreachable.
  await startCheckout({
    planId,
    phoneRegionId,
    phoneQty,
    customer: { name, email, company, phone, industry, useCase },
  })

  // Unreachable — keeps TS happy with the SignupState return type.
  return { ok: true }
}
