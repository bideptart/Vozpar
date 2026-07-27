import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays, Clock } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { BLOG_POSTS, getPost, formatPostDate, type Block } from "@/lib/blog"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/jsonld"
import { RelatedLinks } from "@/components/seo/related-links"
import {
  FloatingAccents,
  ParticleField,
  FloatingIconBadges,
} from "@/components/industries/industries-fx"

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
  if (!post) return pageSeo({ title: "Blog", description: "Vozpar blog.", path: "/blog" })
  return pageSeo({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}` })
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>
    case "html":
      return <p dangerouslySetInnerHTML={{ __html: block.html }} />
    case "h2":
      return <h2>{block.text}</h2>
    case "h3":
      return <h3>{block.text}</h3>
    case "callout":
      return (
        <div className={`post-callout${block.variant === "warn" ? " warn" : ""}`}>
          <p dangerouslySetInnerHTML={{ __html: block.html }} />
        </div>
      )
    case "table":
      return (
        <div className="post-table-wrap">
          <table>
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{j === 0 ? <strong>{cell}</strong> : cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case "cards":
      return (
        <div className="post-cards">
          {block.items.map((c) => (
            <div key={c.title} className="post-card">
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      )
    case "figure":
      return (
        <figure>
          <div dangerouslySetInnerHTML={{ __html: block.svg }} />
          <figcaption>{block.caption}</figcaption>
        </figure>
      )
    case "image":
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <figure>
          <img src={block.src} alt={block.alt} loading="lazy" />
        </figure>
      )
    case "faq":
      return (
        <div className="post-faq">
          {block.items.map((item) => (
            <div key={item.q}>
              <p className="faq-q">{item.q}</p>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      )
    default:
      return null
  }
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
  const faqItems = post.content.flatMap((b) => (b.type === "faq" ? b.items : []))

  return (
    <main className="min-h-dvh bg-black text-foreground">
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      {faqItems.length > 0 && <FaqJsonLd items={faqItems} />}

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50 bg-black">
        <FloatingAccents />
        <ParticleField />
        <FloatingIconBadges />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent_70%)]"
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
            <h1 className="mt-4 text-balance font-heading text-[2.6rem] font-medium leading-[1.07] tracking-[-0.035em] text-white sm:text-5xl md:text-[3rem] lg:text-[3.25rem]">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">By {post.author}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Cover */}
      {post.cover && (
        <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover}
            alt={post.title}
            className="mt-8 w-full rounded-2xl border border-border/60"
          />
        </div>
      )}

      {/* Body */}
      <article className="legal mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-14">
        {post.content.map((block, i) => (
          <BlockView key={i} block={block} />
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
