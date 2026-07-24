import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { INDUSTRIES, getIndustry } from "@/lib/industries"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/jsonld"
import { IndustryClient } from "./IndustryClient"

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const industry = getIndustry(slug)
  if (!industry) return {}

  return pageSeo({
    title: `AI voice agents for ${industry.name.toLowerCase()}`,
    description: industry.short,
    path: `/industries/${industry.slug}`,
  })
}

// Helper to remove icon
function stripIcon<T extends { icon?: any }>(obj: T): Omit<T, "icon"> {
  const { icon, ...rest } = obj
  return rest
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const industry = getIndustry(slug)
  if (!industry) notFound()

  const related = INDUSTRIES.filter((i) => i.slug !== industry.slug)
    .slice(0, 3)
    .map(stripIcon)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: industry.name, path: `/industries/${industry.slug}` },
        ]}
      />
      <ServiceJsonLd
        name={`AI voice agents for ${industry.name.toLowerCase()}`}
        description={industry.pitch}
        path={`/industries/${industry.slug}`}
        serviceType="AI voice agent"
      />
      <IndustryClient industry={stripIcon(industry)} related={related} />
    </>
  )
}
