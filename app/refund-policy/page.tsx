import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage } from "@/components/legal/legal-page"
import { pageSeo } from "@/lib/seo"

export const metadata: Metadata = pageSeo({
  title: "Billing, Refund & Cancellation Policy",
  description:
    "Vozpar billing terms: charges and usage fees, payment terms, automatic renewal and click-to-cancel, EU/UK cooling-off, cancellation, refunds, prepaid credit expiry, and chargebacks.",
  path: "/refund-policy",
})

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Billing, Refund &" accent="Cancellation." name="Billing, Refund & Cancellation Policy" path="/refund-policy">
      <p>
        This policy is part of the <Link href="/terms">Master Services Agreement</Link> and explains billing, renewals,
        cancellation, and refunds for the Services.
      </p>

      <h2>1. Charges</h2>
      <p>
        Charges include recurring subscription fees and usage fees (per-minute, per-number, add-ons) at the rates shown
        in the Service. Usage is billed in arrears or drawn from a prepaid balance. All fees are exclusive of taxes.
      </p>

      <h2>2. Payment Terms</h2>
      <p>
        Vozpar operates primarily on a prepaid voice-credit model; subscription fees, where applicable, are billed in
        advance via the payment method on file. You authorise Vozpar and its payment processor to charge for all amounts
        due. Failed or late payments may incur interest where permitted and may lead to suspension after notice.
      </p>

      <h2>3. Automatic Renewal</h2>
      <p>
        Subscriptions renew automatically unless cancelled before the renewal date. Price, interval, and auto-renewal are
        disclosed at purchase and restated in your confirmation, and — consistent with US state auto-renewal laws (e.g.
        California&apos;s ARL / click-to-cancel) — you can cancel online at any time. We give at least 30 days&apos;
        notice of price or material term changes.
      </p>

      <h2>4. EU/UK Consumer Cooling-Off</h2>
      <p>
        Where an EU or UK consumer (a person acting outside a trade or profession) contracts at a distance, a 14-day
        right of withdrawal may apply unless lawfully waived. As a business-only service this will rarely apply, but
        where it does, we honour it.
      </p>

      <h2>5. Cancellation</h2>
      <p>
        You may cancel future renewals at any time in account settings or by emailing{" "}
        <a href="mailto:support@Vozpar">support@Vozpar</a>. Cancellation stops future renewals; the Services continue
        until the end of the current paid term. Provisioned numbers are released per carrier rules. Number and data
        handling on exit follow the MSA, <Link href="/dpa">DPA</Link>, and <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>6. Refunds</h2>
      <p>
        As a business service, subscription fees and used prepaid credit are generally non-refundable once a term or
        usage has started, except where this policy or mandatory law provides otherwise, or where the Services were
        materially unavailable due to our fault beyond the <Link href="/sla">SLA</Link>. Unused prepaid credit expires 60
        days from purchase. Where a refund is due, we process it to the original method within 14 days (EU/UK consumers)
        or 30 days (others).
      </p>

      <h2>7. Disputed Charges and Chargebacks</h2>
      <p>
        Contact <a href="mailto:support@Vozpar">support@Vozpar</a> before disputing a charge with your bank; most
        issues resolve within one business day. Accounts with chargebacks may be suspended pending investigation.
        Statutory consumer rights, where they apply, are not affected.
      </p>

      <h2>Contact</h2>
      <ul>
        <li><strong>Support:</strong> <a href="mailto:support@Vozpar">support@Vozpar</a></li>
        <li><strong>Legal:</strong> <a href="mailto:legal@Vozpar">legal@Vozpar</a></li>
      </ul>
      <p>Rozper, 46 Shopping Plaza, Unit #5092 Chagrin Falls, OH 44022.</p>
    </LegalPage>
  )
}
