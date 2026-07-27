import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { BlogFilterSection } from "@/components/blog/blog-filter-section"
import { BLOG_POSTS } from "@/lib/blog"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"
import {
  FloatingAccents,
  ParticleField,
  FloatingIconBadges,
} from "@/components/industries/industries-fx"

export const metadata: Metadata = pageSeo({
  title: "Blog",
  description:
    "Notes on building AI voice agents that sound human — product, engineering, platform, and compliance insights from the Vozpar team.",
  path: "/blog",
})

export default function BlogIndexPage() {
  return (
    <main className="min-h-dvh bg-black text-foreground">
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50 bg-black py-20 md:py-28">
        <FloatingAccents />
        <ParticleField />
        <FloatingIconBadges />
        {/* Glow ambient background effects */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 h-[500px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(37,99,235,0.14),transparent_75%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
        />

        <div className="relative mx-auto w-full max-w-4xl px-4 text-center md:px-6">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              VOICE AI INSIGHTS & ENGINEERING
            </div>

            <h1 className="mt-6 text-balance font-heading text-[2.6rem] font-medium leading-[1.07] tracking-[-0.035em] text-white sm:text-5xl md:text-[3rem] lg:text-[3.25rem]">
              Voice AI <span className="bg-gradient-to-r from-primary via-blue-400 to-accent bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(4,107,210,0.25)]">Notes.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              Behind-the-scenes insights into the technology, engineering, and strategies powering AI voice agents built to communicate like humans.
            </p>

            {/* Quick Feature Stats Bar */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-muted-foreground sm:gap-8">
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 backdrop-blur-sm">
                <span className="font-semibold text-foreground">10+</span> In-Depth Guides
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Technical & Compliance Focus
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 backdrop-blur-sm">
                <span className="font-semibold text-foreground">Sub-300ms</span> Architecture
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Categories & Search Filter Component */}
      <BlogFilterSection posts={BLOG_POSTS} />

      <SiteFooter />
    </main>
  )
}
