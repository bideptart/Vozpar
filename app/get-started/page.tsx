import type { Metadata } from "next"
import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SignupForm } from "@/components/get-started/signup-form"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"

export const metadata: Metadata = pageSeo({
  title: "Get started — launch your AI voice agent",
  description:
    "Spin up your AI voice agent in minutes. Choose a credit plan, optionally add a phone number, and start talking.",
  path: "/get-started",
})

export default function GetStartedPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Get started", path: "/get-started" },
        ]}
      />

      <section className="relative overflow-hidden border-b border-border/50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[360px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(220,38,38,0.10),transparent_70%)]"
        />
        <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-balance text-4xl font-serif font-normal tracking-tight md:text-5xl">
              Spin up your voice agent.
            </h1>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Pick a starting credit, optionally add a phone number, and tell us what your agent should do. You&apos;ll
              be live in under 5 minutes — no contracts, no setup fee.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
          <SignupForm />
        </Suspense>
      </section>

      <SiteFooter />
    </main>
  )
}
