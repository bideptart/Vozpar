import type { Metadata } from "next"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Sign-in link expired",
  robots: { index: false, follow: false },
}

export default function AuthErrorPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-10 flex justify-center">
          <Logo height={36} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Sign-in link expired</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The link you used has already been consumed or has expired. Request a fresh one and try again.
        </p>
        <Button asChild className="mt-8">
          <Link href="/admin/login">Back to sign in</Link>
        </Button>
      </div>
    </main>
  )
}
