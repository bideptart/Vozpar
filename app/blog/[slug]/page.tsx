import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays, Clock } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { BLOG_POSTS, getPost, formatPostDate } from "@/lib/blog"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"
import { RelatedLinks } from "@/components/seo/related-links"

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return pageSeo({ title: "Blog", description: "9278.ai blog.", path: "/blog" })
  return pageSeo({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}` })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const more = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
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
        <div className="relative mx-auto w-full max-w-3xl px-4 py-14 md:px-6 md:py-16">
          <ScrollReveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> All articles
            </Link>
            <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">{post.category}</span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" /> {formatPostDate(post.date)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {post.readingMinutes} min read
              </span>
            </div>
            <h1 className="mt-4 text-balance text-3xl font-serif font-normal leading-[1.1] tracking-tight md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">By {post.author}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Body */}
      <article className="legal mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-14">
        {post.content.map((section, i) => (
          <section key={i}>
            {section.heading && <h2>{section.heading}</h2>}
            {section.body.map((para, j) => (
              <p key={j}>{para}</p>
            ))}
          </section>
        ))}

        <hr className="my-10 border-border/60" />
        <p>
          Want to see it in action? <Link href="/get-started">Build your first agent</Link> or{" "}
          <Link href="/contact">talk to the team</Link>.
        </p>
      </article>

      <RelatedLinks
        heading="More from the blog"
        description="Keep reading."
        links={more.map((p) => ({
          href: `/blog/${p.slug}`,
          title: p.title,
          description: p.excerpt,
        }))}
      />

      <SiteFooter />
    </main>
  )
}
