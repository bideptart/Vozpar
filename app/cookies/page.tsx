import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage } from "@/components/legal/legal-page"
import { pageSeo } from "@/lib/seo"

export const metadata: Metadata = pageSeo({
  title: "Cookie Policy",
  description:
    "How Vozpar uses cookies and similar technologies (localStorage/sessionStorage) across its website and dashboard, the categories used, and how to manage your choices — including GPC and US opt-out.",
  path: "/cookies",
})

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie" accent="Policy." name="Cookie Policy" path="/cookies">
      <p>
        This Cookie Policy explains how Vozpar uses cookies and similar technologies (including localStorage and
        sessionStorage) on its websites and dashboard. It supports our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>1. What These Technologies Are</h2>
      <p>
        Cookies are small files a website stores in your browser; localStorage/sessionStorage hold small pieces of data.
        They can be first-party or third-party, and session or persistent.
      </p>

      <h2>2. Categories We Use</h2>
      <ul>
        <li>
          <strong>Strictly necessary</strong> — sign-in/session, security, load balancing, and remembering your cookie
          choice. Consent not required.
        </li>
        <li>
          <strong>Functional</strong> — remember preferences such as language or region. Consent where required.
        </li>
        <li>
          <strong>Analytics</strong> — understand usage (e.g. privacy-friendly product analytics), only where enabled.
          Consent in the EU/UK/Brazil.
        </li>
        <li>
          <strong>Marketing</strong> — advertising/retargeting pixels, only if and where enabled. Consent / US opt-out.
        </li>
      </ul>

      <h2>3. Managing Cookies</h2>
      <p>
        Where non-essential cookies are used, you can accept or refuse them via our consent banner and change your choice
        anytime; US users can opt out of sale/share and we honour Global Privacy Control (GPC). You can also delete or
        block cookies in your browser settings. Under EU/UK ePrivacy and Brazil&apos;s LGPD, non-essential cookies load
        only after consent.
      </p>

      <h2>Contact</h2>
      <ul>
        <li><strong>Privacy:</strong> <a href="mailto:privacy@Vozpar">privacy@Vozpar</a></li>
      </ul>
      <p>Rozper, 46 Shopping Plaza, Unit #5092 Chagrin Falls, OH 44022.</p>
    </LegalPage>
  )
}
