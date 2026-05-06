import type { Metadata } from "next"

/**
 * Single source of truth for site-wide SEO. Public site URL is read from
 * NEXT_PUBLIC_SITE_URL with a sensible production default — this lets the
 * sitemap, OG, and canonicals all stay correct on Vercel previews,
 * Hostinger, and localhost without per-page edits.
 */
export const SITE = {
  name: "9278.ai",
  domain: "9278.ai",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://9278.ai",
  description:
    "Build, launch, and scale AI voice agents that actually sound human. Carrier-grade phone numbers, sub-second latency, transparent per-minute pricing.",
  twitter: "@9278ai",
  locale: "en_US",
} as const

export const SITE_URL = SITE.url

/** Build a fully-qualified absolute URL from a path. */
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`
}

type PageSeoInput = {
  title: string
  description?: string
  /** Path on this site (e.g. "/pricing"). */
  path: string
  /** Override OG image. Defaults to the site OG. */
  image?: string
  /** Mark page as noindex (admin / auth / thanks). */
  noindex?: boolean
}

/**
 * Page-level Metadata helper. Always sets canonical, OpenGraph, and Twitter
 * cards. Title template is applied by the root layout.
 */
export function pageSeo({ title, description, path, image, noindex }: PageSeoInput): Metadata {
  const url = absoluteUrl(path)
  const desc = description ?? SITE.description
  const og = image ?? "/opengraph-image"

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      siteName: SITE.name,
      title,
      description: desc,
      locale: SITE.locale,
      images: [{ url: og, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitter,
      creator: SITE.twitter,
      title,
      description: desc,
      images: [og],
    },
  }
}
