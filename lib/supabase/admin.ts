import "server-only"
import { createClient } from "@supabase/supabase-js"

/**
 * Service-role Supabase client. Bypasses RLS — only import in server code
 * (server actions, route handlers, server components called from a route).
 *
 * Used for:
 * - Stripe webhook persistence
 * - Admin dashboard reads (defence-in-depth on top of the auth-gated proxy)
 * - Promoting whitelisted users to `app_metadata.role = 'super_admin'`
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      "Supabase admin client not configured: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    )
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function isSupabaseAdminConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}
