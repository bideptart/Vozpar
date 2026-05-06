import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin"
import { isAdminEmail } from "@/lib/admin/auth"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/admin"

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/error`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !data?.user) {
    return NextResponse.redirect(`${origin}/auth/error`)
  }

  const user = data.user

  // If the email is on the ADMIN_EMAILS whitelist, ensure the user has the
  // `super_admin` app_metadata role. We use the service-role client because
  // setting app_metadata requires admin privileges.
  if (isAdminEmail(user.email) && isSupabaseAdminConfigured()) {
    const currentRole =
      (user.app_metadata as { role?: string } | null)?.role ?? null
    if (currentRole !== "super_admin") {
      try {
        const admin = createAdminClient()
        await admin.auth.admin.updateUserById(user.id, {
          app_metadata: { ...(user.app_metadata ?? {}), role: "super_admin" },
        })
        // Force a JWT refresh so the new app_metadata is reflected immediately.
        await supabase.auth.refreshSession()
      } catch {
        // Continue — the dashboard will redirect to /admin/login if not promoted.
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
