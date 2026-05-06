import "server-only"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

/**
 * Returns the comma-separated list of admin emails from `ADMIN_EMAILS`.
 * Emails are normalized to lower-case and trimmed. Empty list ⇒ no one is admin.
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const list = getAdminEmails()
  return list.length > 0 && list.includes(email.toLowerCase())
}

/**
 * Server-component / server-action helper.
 * Returns the signed-in admin user, or redirects to /admin/login.
 */
export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")
  const role =
    (user.app_metadata as { role?: string } | null)?.role ??
    (user.user_metadata as { role?: string } | null)?.role
  if (role !== "super_admin") redirect("/admin/login?denied=1")
  return user
}
