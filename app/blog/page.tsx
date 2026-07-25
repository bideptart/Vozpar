import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CalendarDays, Clock } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { BLOG_POSTS, formatPostDate } from "@/lib/blog"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"

export const metadata: Metadata = pageSeo({
  title: "Blog",
  description:
    "Notes on building AI voice agents that sound human — product, engineering, platform, and compliance insights from the Vozpar team.",
  path: "/blog",
})

export default function BlogIndexPage() {
  const featured = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0]
  const rest = BLOG_POSTS.filter((p) => p.slug !== featured.slug)

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50 py-20 md:py-28">
        {/* Glow ambient background effects */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 h-[500px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(220,38,38,0.18),transparent_75%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-10 h-72 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
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

            <h1 className="mt-6 text-balance text-4xl font-serif font-normal leading-[1.08] tracking-tight sm:text-5xl md:text-7xl">
              Voice AI <span className="bg-gradient-to-r from-primary via-red-400 to-accent bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(220,38,38,0.25)]">Notes.</span>
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

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        {/* Featured */}
        <ScrollReveal>
          <Link
            href={`/blog/${featured.slug}`}
            className="card-glow group grid gap-6 rounded-2xl p-6 md:grid-cols-[1.4fr_1fr] md:p-8"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                  {featured.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" /> {formatPostDate(featured.date)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {featured.readingMinutes} min read
                </span>
              </div>
              <h2 className="mt-4 text-balance text-2xl font-serif font-normal tracking-tight transition-colors group-hover:text-primary md:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{featured.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Read article
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
            {featured.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featured.cover}
                alt={featured.title}
                className="hidden h-full w-full rounded-xl object-cover ring-1 ring-border/60 md:block"
              />
            ) : (
              <div
                aria-hidden
                className="hidden rounded-xl bg-[radial-gradient(120%_120%_at_20%_0%,rgba(220,38,38,0.14),transparent_60%)] ring-1 ring-border/60 md:block"
              />
            )}
          </Link>
        </ScrollReveal>

        {/* Grid */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {rest.map((post) => (
            <ScrollReveal key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="card-glow group flex h-full flex-col overflow-hidden rounded-2xl">
                {post.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.cover} alt={post.title} className="h-40 w-full object-cover" />
                )}
                <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {post.readingMinutes} min
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <span className="mt-4 text-xs text-muted-foreground">{formatPostDate(post.date)}</span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
