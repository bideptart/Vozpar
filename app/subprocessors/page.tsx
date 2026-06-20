import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage } from "@/components/legal/legal-page"
import { pageSeo } from "@/lib/seo"

export const metadata: Metadata = pageSeo({
  title: "Sub-Processor List",
  description:
    "The third-party sub-processors 9278.ai engages to help provide the Services — infrastructure, communications/voice, AI (LLM/ASR/TTS), and payments/analytics/support — with safeguards.",
  path: "/subprocessors",
})

export default function SubProcessorsPage() {
  return (
    <LegalPage title="Sub-Processor" accent="List." name="Sub-Processor List" path="/subprocessors">
      <p>
        A sub-processor is a third party 9278.ai engages to process personal data to help provide the Services, per the{" "}
        <Link href="/privacy">Privacy Policy</Link> and <Link href="/dpa">DPA</Link>. We impose data-protection terms on
        each and require appropriate safeguards (EU SCCs / UK IDTA where relevant). Business customers can subscribe to
        change notifications at <a href="mailto:privacy@9278.ai">privacy@9278.ai</a>; we give at least 14 days&apos;
        notice before adding a new sub-processor that processes Customer Personal Data.
      </p>

      <h2>1. Infrastructure and Platform</h2>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> — application &amp; website hosting, edge CDN, and DDoS protection — United States
          / global edge — EU SCCs / UK IDTA.
        </li>
        <li>
          <strong>Supabase</strong> — database, authentication, and storage of account data, recordings, and transcripts
          — EU SCCs / UK IDTA.
        </li>
      </ul>

      <h2>2. Communications / Voice</h2>
      <ul>
        <li>
          <strong>Your connected carrier(s) / SIP provider(s)</strong> — call origination/termination and DID
          provisioning. 9278.ai connects to the carrier account you bring; those numbers and charges remain with your
          carrier under its terms.
        </li>
        <li>
          <strong>SMS aggregators / 10DLC</strong> — where SMS is offered, message delivery and US A2P 10DLC
          registration — global — EU SCCs / UK IDTA.
        </li>
      </ul>

      <h2>3. AI (LLM / Speech)</h2>
      <ul>
        <li>
          <strong>Large-language-model provider(s)</strong> — language understanding and generation. Providers are bound
          not to train on your data; specific vendors are confirmed on request.
        </li>
        <li>
          <strong>Speech-to-text (ASR) provider(s)</strong> — transcription — confirmed on request — EU SCCs / UK IDTA.
        </li>
        <li>
          <strong>Text-to-speech (TTS) / voice provider(s)</strong> — AI voice synthesis — confirmed on request — EU
          SCCs / UK IDTA.
        </li>
      </ul>

      <h2>4. Payments, Analytics, Support</h2>
      <ul>
        <li>
          <strong>Stripe</strong> — payment processing and billing — United States / global — EU SCCs / UK IDTA.
        </li>
        <li>
          <strong>Vercel Analytics</strong> — privacy-friendly website/product analytics (consent-based where required).
        </li>
        <li>
          <strong>Hostinger</strong> — transactional and contact email delivery.
        </li>
      </ul>
      <p>
        App stores (Apple, Google) act as independent controllers for their own platform processing and are not 9278.ai
        sub-processors.
      </p>

      <h2>Contact</h2>
      <ul>
        <li><strong>Privacy:</strong> <a href="mailto:privacy@9278.ai">privacy@9278.ai</a></li>
        <li><strong>Support:</strong> <a href="mailto:support@9278.ai">support@9278.ai</a></li>
      </ul>
      <p>Ace Peak Invest Pte Ltd (9278.ai), 1 Scotts Road, #24-10, Shaw Centre, Singapore 228208.</p>
    </LegalPage>
  )
}
