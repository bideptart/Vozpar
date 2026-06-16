"use client"

import { useState } from "react"
import { Send, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Status = "idle" | "submitting" | "success"

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("submitting")
    // Front-end only — wire this to an email/CRM endpoint (e.g. Resend, a
    // Supabase edge function, or a /api/contact route) to actually deliver.
    setTimeout(() => setStatus("success"), 700)
  }

  if (status === "success") {
    return (
      <div className="card-glow flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <h3 className="mt-5 text-xl font-serif font-normal tracking-tight">Message sent.</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thanks for reaching out — the 9278.ai team will reply by email, usually within one business day.
        </p>
        <Button variant="outline" className="mt-6 rounded-full" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    )
  }

  const submitting = status === "submitting"

  return (
    <form onSubmit={handleSubmit} className="card-glow rounded-2xl p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-primary">*</span>
          </Label>
          <Input id="name" name="name" required placeholder="Your name" autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-primary">*</span>
          </Label>
          <Input id="email" name="email" type="email" required placeholder="you@company.com" autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">
            Mobile <span className="text-primary">*</span>
          </Label>
          <Input
            id="mobile"
            name="mobile"
            type="tel"
            required
            inputMode="tel"
            placeholder="+1 555 000 1234"
            autoComplete="tel"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">
            Company <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input id="company" name="company" placeholder="Company name" autoComplete="organization" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="subject">
            Subject <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input id="subject" name="subject" placeholder="What's this about?" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="message">
            Message <span className="text-primary">*</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            required
            rows={6}
            placeholder="Tell us how we can help…"
            className="resize-y"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={submitting} className="btn-ai rounded-full px-6">
          {submitting ? (
            <>
              Sending… <Loader2 className="ml-1 h-4 w-4 animate-spin" aria-hidden />
            </>
          ) : (
            <>
              Send message <Send className="ml-1 h-4 w-4" aria-hidden />
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">We&apos;ll only use your details to reply to this enquiry.</p>
      </div>
    </form>
  )
}
