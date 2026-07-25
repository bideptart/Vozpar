"use server"

import { redirect } from "next/navigation"

export type CheckoutOptions = {
  planId: string
  phoneRegionId?: string
  phoneQty?: number
  customer?: {
    name?: string
    email?: string
    company?: string
    phone?: string
    industry?: string
    useCase?: string
  }
}

export async function startCheckout(options: CheckoutOptions) {
  const planId = options.planId || "starter"
  redirect(`/get-started?plan=${planId}`)
}

export async function checkoutPlanAction(formData: FormData) {
  const planId = String(formData.get("planId") || "starter")
  redirect(`/get-started?plan=${planId}`)
}
