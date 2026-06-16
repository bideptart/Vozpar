import { SITE, absoluteUrl } from "@/lib/seo"

/** Inline a JSON-LD <script> safely. Server component. */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE.name,
        url: SITE.url,
        logo: absoluteUrl("/logo.png"),
        sameAs: ["https://voice.9278.ai/"],
      }}
    />
  )
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE.name,
        url: SITE.url,
        publisher: { "@type": "Organization", name: SITE.name },
      }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; path: string }> }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: absoluteUrl(item.path),
        })),
      }}
    />
  )
}

export function FaqJsonLd({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      }}
    />
  )
}

export function PricingJsonLd({
  offers,
}: {
  offers: Array<{ name: string; amount: number; description: string; ratePerMin: number }>
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${SITE.name} voice credit`,
        description: "AI voice agent credit. Pay-as-you-go per voice minute.",
        brand: { "@type": "Brand", name: SITE.name },
        offers: offers.map((o) => ({
          "@type": "Offer",
          name: o.name,
          price: o.amount,
          priceCurrency: "USD",
          description: o.description,
          availability: "https://schema.org/InStock",
          url: absoluteUrl("/pricing"),
        })),
      }}
    />
  )
}

export function ServiceJsonLd({
  name,
  description,
  path,
  serviceType,
}: {
  name: string
  description: string
  path: string
  serviceType: string
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        url: absoluteUrl(path),
        provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
        serviceType,
        areaServed: ["United States", "Canada", "United Kingdom", "European Union"],
      }}
    />
  )
}
