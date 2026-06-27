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
    "Notes on building AI voice agents that sound human — product, engineering, platform, and compliance insights from the 9278.ai team.",
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
      <section className="relative overflow-hidden border-b border-border/50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(220,38,38,0.10),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="relative mx-auto w-full max-w-4xl px-4 py-16 text-center md:px-6 md:py-20">
          <ScrollReveal>
            <span className="ai-pill-magenta">
              <span className="h-1 w-1 rounded-full bg-accent" />
              Blog
            </span>
            <h1 className="mt-6 text-balance text-4xl font-serif font-normal leading-[1.05] tracking-tight md:text-6xl">
              Notes on <span className="text-primary">voice AI.</span>
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Product, engineering, platform, and compliance insights from the team building AI voice agents that
              actually sound human.
            </p>
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
            <div
              aria-hidden
              className="hidden rounded-xl bg-[radial-gradient(120%_120%_at_20%_0%,rgba(220,38,38,0.14),transparent_60%)] ring-1 ring-border/60 md:block"
            />
          </Link>
        </ScrollReveal>

        {/* Grid */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {rest.map((post) => (
            <ScrollReveal key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="card-glow group flex h-full flex-col rounded-2xl p-6">
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
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
