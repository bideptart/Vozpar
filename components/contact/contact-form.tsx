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
  const [error, setError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setStatus("submitting")
    setError(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Something went wrong. Please try again.")
      }
      form.reset()
      setStatus("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setStatus("idle")
    }
  }

  if (status === "success") {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-sky-500/50 bg-[#080b12] p-8 text-center backdrop-blur-xl shadow-[0_0_40px_rgba(4,107,210,0.35)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 ring-1 ring-sky-400/30 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </div>
        <h3 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-white">Message sent!</h3>
        <p className="mt-2.5 max-w-sm mx-auto font-sans text-sm leading-relaxed text-slate-300">
          Thanks for reaching out — the Vozpar team will reply by email, usually within one business day.
        </p>
        <Button
          variant="outline"
          className="mt-7 rounded-full border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 hover:text-white"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </Button>
      </div>
    )
  }

  const submitting = status === "submitting"

  return (
    <div
      onClick={() => setIsFocused(true)}
      className={`group relative h-full flex flex-col justify-between overflow-hidden rounded-3xl border p-6 sm:p-8 md:p-9 backdrop-blur-xl transition-all duration-500 ${
        isFocused
          ? "border-sky-400 bg-[#080c16] shadow-[0_0_45px_rgba(56,189,248,0.35)]"
          : "border-sky-500/50 bg-[#080b12] shadow-[0_0_35px_rgba(4,107,210,0.35)] hover:border-sky-400/80"
      }`}
    >
      {/* 4 Corner Brackets (Krikkers) - revealed on click/focus */}
      <span
        className={`pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 border-l-2 border-t-2 border-sky-400 rounded-tl-sm transition-all duration-300 ${
          isFocused ? "opacity-100 scale-100" : "opacity-0 scale-75 group-hover:opacity-60 group-hover:scale-90"
        }`}
      />
      <span
        className={`pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 border-r-2 border-t-2 border-sky-400 rounded-tr-sm transition-all duration-300 ${
          isFocused ? "opacity-100 scale-100" : "opacity-0 scale-75 group-hover:opacity-60 group-hover:scale-90"
        }`}
      />
      <span
        className={`pointer-events-none absolute bottom-2.5 left-2.5 h-3.5 w-3.5 border-b-2 border-l-2 border-sky-400 rounded-bl-sm transition-all duration-300 ${
          isFocused ? "opacity-100 scale-100" : "opacity-0 scale-75 group-hover:opacity-60 group-hover:scale-90"
        }`}
      />
      <span
        className={`pointer-events-none absolute bottom-2.5 right-2.5 h-3.5 w-3.5 border-b-2 border-r-2 border-sky-400 rounded-br-sm transition-all duration-300 ${
          isFocused ? "opacity-100 scale-100" : "opacity-0 scale-75 group-hover:opacity-60 group-hover:scale-90"
        }`}
      />

      <form
        onSubmit={handleSubmit}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsFocused(false)
          }
        }}
        className="relative z-10 space-y-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className={`text-sm font-semibold transition-colors ${
                isFocused ? "text-sky-300" : "text-slate-100"
              }`}
            >
              Name <span className="text-sky-400">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Your name"
              autoComplete="name"
              className="h-11 rounded-xl border border-white/15 bg-black/40 text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:bg-sky-950/20 focus:ring-2 focus:ring-sky-400/30 transition-all font-sans"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className={`text-sm font-semibold transition-colors ${
                isFocused ? "text-sky-300" : "text-slate-100"
              }`}
            >
              Email <span className="text-sky-400">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              autoComplete="email"
              className="h-11 rounded-xl border border-white/15 bg-black/40 text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:bg-sky-950/20 focus:ring-2 focus:ring-sky-400/30 transition-all font-sans"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="mobile"
              className={`text-sm font-semibold transition-colors ${
                isFocused ? "text-sky-300" : "text-slate-100"
              }`}
            >
              Mobile <span className="text-sky-400">*</span>
            </Label>
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              required
              inputMode="tel"
              placeholder="+1 555 000 1234"
              autoComplete="tel"
              className="h-11 rounded-xl border border-white/15 bg-black/40 text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:bg-sky-950/20 focus:ring-2 focus:ring-sky-400/30 transition-all font-sans"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="company"
              className={`text-sm font-semibold transition-colors ${
                isFocused ? "text-sky-300" : "text-slate-100"
              }`}
            >
              Company <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <Input
              id="company"
              name="company"
              placeholder="Company name"
              autoComplete="organization"
              className="h-11 rounded-xl border border-white/15 bg-black/40 text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:bg-sky-950/20 focus:ring-2 focus:ring-sky-400/30 transition-all font-sans"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label
              htmlFor="subject"
              className={`text-sm font-semibold transition-colors ${
                isFocused ? "text-sky-300" : "text-slate-100"
              }`}
            >
              Subject <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <Input
              id="subject"
              name="subject"
              placeholder="What's this about?"
              className="h-11 rounded-xl border border-white/15 bg-black/40 text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:bg-sky-950/20 focus:ring-2 focus:ring-sky-400/30 transition-all font-sans"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label
              htmlFor="message"
              className={`text-sm font-semibold transition-colors ${
                isFocused ? "text-sky-300" : "text-slate-100"
              }`}
            >
              Message <span className="text-sky-400">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Tell us how we can help…"
              className="resize-y rounded-xl border border-white/15 bg-black/40 p-4 text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:bg-sky-950/20 focus:ring-2 focus:ring-sky-400/30 transition-all font-sans"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#046bd2] to-[#2d98f1] hover:from-[#046bd2]/90 hover:to-[#2d98f1]/90 px-7 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(4,107,210,0.5)] transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {submitting ? (
              <>
                Sending… <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              </>
            ) : (
              <>
                Send message <Send className="h-4 w-4" aria-hidden />
              </>
            )}
          </Button>
          <p className="text-xs text-slate-400 max-w-xs">We&apos;ll only use your details to reply to this enquiry.</p>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-400 font-medium" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}
