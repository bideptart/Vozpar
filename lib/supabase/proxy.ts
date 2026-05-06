import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT: do not run code between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Gate the admin area: must be signed in AND flagged as super_admin.
  // The login page itself must remain reachable to unauthenticated users —
  // otherwise the redirect below would point at the very page being gated
  // and we'd loop forever.
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      url.searchParams.set("next", path)
      return NextResponse.redirect(url)
    }
    const role =
      (user.app_metadata as { role?: string } | null)?.role ??
      (user.user_metadata as { role?: string } | null)?.role
    if (role !== "super_admin") {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      url.searchParams.set("denied", "1")
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
