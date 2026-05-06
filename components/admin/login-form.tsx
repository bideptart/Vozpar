"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Loader2, CheckCircle2 } from "lucide-react"
import { sendAdminMagicLink, type LoginState } from "@/app/admin/login/actions"

const initial: LoginState = {}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(sendAdminMagicLink, initial)

  if (state?.ok) {
    return (
      <div className="rounded-lg border border-border/60 bg-card p-6">
        <div className="flex items-center gap-3 text-foreground">
          <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />
          <p className="font-medium">Check your inbox</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a one-time sign-in link to{" "}
          <span className="font-medium text-foreground">{state.email}</span>. Open it on this device to access the
          dashboard.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Work email</Label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@9278.ai"
            defaultValue={state?.email ?? ""}
            className="pl-9"
          />
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> Sending link…
          </>
        ) : (
          "Send sign-in link"
        )}
      </Button>
    </form>
  )
}
