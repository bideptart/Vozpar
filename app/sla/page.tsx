import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage } from "@/components/legal/legal-page"
import { pageSeo } from "@/lib/seo"

export const metadata: Metadata = pageSeo({
  title: "Service Level Agreement (SLA)",
  description:
    "Vozpar's Service Level Agreement: monthly uptime commitment, support response targets, exclusions, and service credits for paid subscriptions in good standing.",
  path: "/sla",
})

export default function SlaPage() {
  return (
    <LegalPage title="Service Level" accent="Agreement." name="Service Level Agreement (SLA)" path="/sla">
      <p>
        This SLA forms part of the <Link href="/terms">Master Services Agreement</Link> and applies to paid
        subscriptions in good standing.
      </p>

      <h2>1. Availability Commitment</h2>
      <p>
        Vozpar will use commercially reasonable efforts to make the core platform available at least{" "}
        <strong>99.9%</strong> of the time each calendar month (&ldquo;Monthly Uptime&rdquo;), measured as (total minutes
        − Downtime minutes) ÷ total minutes. &ldquo;Downtime&rdquo; means sustained unavailability of core call-handling
        confirmed by our monitoring, excluding the Section 3 items.
      </p>

      <h2>2. Support Targets</h2>
      <ul>
        <li>
          <strong>P1 — Critical</strong> (platform down / agents not answering): target first response 1 hour, 24×7.
        </li>
        <li>
          <strong>P2 — Major:</strong> target first response 4 business hours.
        </li>
        <li>
          <strong>P3 — Minor / question:</strong> target first response 1 business day.
        </li>
      </ul>
      <p>
        Support channels: email <a href="mailto:support@Vozpar">support@Vozpar</a> and the in-dashboard help, with
        critical (P1) support available 24×7.
      </p>

      <h2>3. Exclusions</h2>
      <p>Downtime excludes:</p>
      <ul>
        <li>scheduled or emergency maintenance (notified where practicable);</li>
        <li>
          issues caused by upstream carriers/SIP partners, the internet, power outages, or the Customer&apos;s
          configuration, prompts, or integrations;
        </li>
        <li>force majeure;</li>
        <li>suspension for breach or non-payment;</li>
        <li>beta features.</li>
      </ul>

      <h2>4. Service Credits</h2>
      <ul>
        <li>Below target but ≥ 99.0% → 10% of the monthly fee.</li>
        <li>Below 99.0% but ≥ 95.0% → 25% of the monthly fee.</li>
        <li>Below 95.0% → 50% of the monthly fee.</li>
      </ul>
      <p>
        Service credits are the Customer&apos;s sole and exclusive remedy for availability shortfalls. To claim, email{" "}
        <a href="mailto:support@Vozpar">support@Vozpar</a> within 30 days of the affected month. Credits apply to
        future invoices and are not refunded in cash.
      </p>

      <h2>Contact</h2>
      <ul>
        <li><strong>Support:</strong> <a href="mailto:support@Vozpar">support@Vozpar</a></li>
        <li><strong>Legal:</strong> <a href="mailto:legal@Vozpar">legal@Vozpar</a></li>
      </ul>
      <p>Ace Peak Invest Pte Ltd (Vozpar), 1 Scotts Road, #24-10, Shaw Centre, Singapore 228208.</p>
    </LegalPage>
  )
}
