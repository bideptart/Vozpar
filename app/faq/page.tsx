import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import FaqClient from "./FaqClient"
import { FLAT_FAQ } from "@/lib/faq"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/jsonld"

export const metadata: Metadata = pageSeo({
  title: "Frequently asked questions",
  description:
    "Answers on pricing, voice credit expiry, phone numbers, AI agents, compliance, and account access at Vozpar.",
  path: "/faq",
})

export default function FaqPage() {
  return (
    <main className="min-h-dvh bg-black text-foreground">
      <SiteHeader />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
      />
      <FaqJsonLd items={FLAT_FAQ} />
      <FaqClient />
      <SiteFooter />
    </main>
  )
}
