"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/admin/auth"

export type LoginState = {
  ok?: boolean
  error?: string
  email?: string
}

export async function sendAdminMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim().toLowerCase()
  if (!email) return { error: "Enter the email you want the link sent to." }

  if (!isAdminEmail(email)) {
    // Don't leak whether the email exists. Generic message.
    return {
      error:
        "This email is not authorized for the super-admin dashboard. Contact the workspace owner to be added.",
      email,
    }
  }

  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https")
  const origin = `${proto}://${host}`

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
        `${origin}/auth/callback?next=/admin`,
    },
  })

  if (error) {
    return { error: error.message, email }
  }

  return { ok: true, email }
}

export async function adminSignOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}
