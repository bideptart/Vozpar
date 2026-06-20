import type { ReactNode } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"

type LegalPageProps = {
  /** Plain part of the heading, e.g. "Cookie" */
  title: string
  /** Red-accent part of the heading, e.g. "Policy." */
  accent: string
  /** Breadcrumb / page name, e.g. "Cookie Policy" */
  name: string
  /** Route, e.g. "/cookies" */
  path: string
  /** e.g. "20 June 2026" */
  updated?: string
  /** Small eyebrow pill text */
  eyebrow?: string
  children: ReactNode
}

export function LegalPage({
  title,
  accent,
  name,
  path,
  updated = "20 June 2026",
  eyebrow = "Legal",
  children,
}: LegalPageProps) {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name, path },
        ]}
      />

      <section className="relative overflow-hidden border-b border-border/50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(220,38,38,0.10),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="relative mx-auto w-full max-w-4xl px-4 py-20 text-center md:px-6 md:py-24">
          <ScrollReveal>
            <span className="ai-pill-magenta">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {eyebrow}
            </span>
            <h1 className="mt-6 text-balance text-4xl font-serif font-normal tracking-tight md:text-6xl">
              {title} <span className="text-primary">{accent}</span>
            </h1>
            <p className="mt-5 text-sm text-muted-foreground">Last updated on {updated}</p>
          </ScrollReveal>
        </div>
      </section>

      <article className="legal mx-auto w-full max-w-3xl px-4 py-16 md:px-6 md:py-20">{children}</article>

      <SiteFooter />
    </main>
  )
}
