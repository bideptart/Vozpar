import type { Metadata } from "next"
import { LegalPage } from "@/components/legal/legal-page"
import { pageSeo } from "@/lib/seo"

export const metadata: Metadata = pageSeo({
  title: "Accessibility Statement",
  description:
    "Vozpar's commitment to accessible websites, dashboard, and apps — aligning with WCAG 2.1 AA, ADA / Section 508, the European Accessibility Act / EN 301 549, and the UK Equality Act.",
  path: "/accessibility",
})

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility" accent="Statement." name="Accessibility Statement" path="/accessibility">
      <p>
        Vozpar wants its websites, dashboard, and applications to be usable by everyone, including people who use
        assistive technology.
      </p>

      <h2>1. Standards We Work To</h2>
      <ul>
        <li>
          <strong>WCAG</strong> — we aim to align with WCAG 2.1 Level AA and are working toward WCAG 2.2.
        </li>
        <li>
          <strong>United States</strong> — committed to the principles of the Americans with Disabilities Act (ADA) and
          Section 508.
        </li>
        <li>
          <strong>EU</strong> — committed to the European Accessibility Act (Directive 2019/882, applicable from 28 June
          2025) and EN 301 549.
        </li>
        <li>
          <strong>United Kingdom</strong> — consistent with the Equality Act 2010.
        </li>
      </ul>

      <h2>2. What We Do and Current Status</h2>
      <p>
        We design for keyboard and screen-reader use, clear focus states, readable contrast, and meaningful labels and
        alt text, and we support browser/OS accessibility features. Current status: partially conforming with WCAG 2.1
        AA; some third-party components and newer features may not yet fully conform. We review accessibility on an
        ongoing basis as we ship changes.
      </p>

      <h2>3. Get Help or Report a Barrier</h2>
      <p>
        If you cannot access part of the Services or need information in another format, contact{" "}
        <a href="mailto:accessibility@Vozpar">accessibility@Vozpar</a>. We will acknowledge within 5 business days and
        aim to resolve within 20 business days.
      </p>

      <h2>Contact</h2>
      <ul>
        <li><strong>Accessibility:</strong> <a href="mailto:accessibility@Vozpar">accessibility@Vozpar</a></li>
        <li><strong>Support:</strong> <a href="mailto:support@Vozpar">support@Vozpar</a></li>
      </ul>
      <p>Vozpar, 1 Scotts Road, #24-10, Shaw Centre, Singapore 228208.</p>
    </LegalPage>
  )
}
