// import { updateSession } from "@/lib/supabase/proxy"
import { NextResponse, type NextRequest } from "next/server"

// Public admin paths — must remain reachable without auth, otherwise the
// middleware would gate the login page itself and loop forever
// (307 -> /admin/login?next=/admin/login).
// const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/auth/callback", "/admin/logout"]

// Supabase magic-link + error pages used by the auth flow.
// const PUBLIC_AUTH_PATHS = ["/auth/callback", "/auth/error"]

export async function middleware(_req: NextRequest) {
  // TEMP: Supabase/Stripe disabled to run the project without env vars.
  // Restore the original logic below when re-enabling auth.
  return NextResponse.next()

  // if (
  //   PUBLIC_ADMIN_PATHS.some((p) => req.nextUrl.pathname === p || req.nextUrl.pathname.startsWith(p + "/"))
  // ) {
  //   return NextResponse.next()
  // }
  //
  // if (
  //   PUBLIC_AUTH_PATHS.some((p) => req.nextUrl.pathname === p || req.nextUrl.pathname.startsWith(p + "/"))
  // ) {
  //   return NextResponse.next()
  // }
  //
  // return await updateSession(req)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
