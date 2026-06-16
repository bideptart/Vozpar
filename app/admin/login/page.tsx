import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { Logo } from "@/components/logo"
import { LoginForm } from "@/components/admin/login-form"
import { createClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/admin/auth"

export const metadata: Metadata = {
  title: "Super-admin sign in — 9278.ai",
  description: "Sign in to the 9278.ai super-admin dashboard.",
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>
}) {
  const { denied } = await searchParams

  // If the visitor is already a whitelisted super-admin, send them straight
  // through. Anyone else (unauthenticated, or signed in but not whitelisted)
  // should see the magic-link form below.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user && isAdminEmail(user.email)) {
    redirect("/admin")
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-10 flex justify-center">
          <Logo height={36} />
        </div>

        <h1 className="text-balance text-2xl font-semibold tracking-tight">Super-admin access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign-in is restricted to whitelisted internal emails. We&apos;ll send a one-time link to your inbox.
        </p>

        {denied && (
          <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
            Your account is not authorized for the super-admin dashboard.
          </div>
        )}

        <div className="mt-8">
          <LoginForm />
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Customer dashboards live at{" "}
          <a
            href="https://voice.9278.ai/"
            className="underline underline-offset-2 hover:text-foreground"
          >
            voice.9278.ai
          </a>
          .
        </p>
      </div>
    </main>
  )
}
