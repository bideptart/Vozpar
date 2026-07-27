import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage } from "@/components/legal/legal-page"
import { pageSeo } from "@/lib/seo"

export const metadata: Metadata = pageSeo({
  title: "Data Processing Agreement",
  description:
    "Vozpar's Data Processing Agreement (DPA): controller/processor roles, processor obligations, sub-processors, EU SCCs and UK IDTA international transfers, CCPA service-provider and LGPD operador terms, and Art. 32 security measures.",
  path: "/dpa",
})

export default function DpaPage() {
  return (
    <LegalPage title="Data Processing" accent="Agreement." name="Data Processing Agreement" path="/dpa">
      <p>
        This Data Processing Agreement (&ldquo;DPA&rdquo;) forms part of the{" "}
        <Link href="/terms">Master Services Agreement</Link> between Vozpar
        (&ldquo;Processor&rdquo;, &ldquo;we&rdquo;) and the business customer (&ldquo;Controller&rdquo;,
        &ldquo;Customer&rdquo;). It applies where Vozpar processes Customer Personal Data on the Customer&apos;s behalf —
        in practice, the personal data of the Customer&apos;s callers handled by the AI agent. For Vozpar&apos;s own
        controller processing, see the <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>1. Roles and Instructions</h2>
      <p>
        The Customer is the controller and Vozpar the processor of Customer Personal Data. Vozpar processes only on the
        Customer&apos;s documented instructions (the MSA, this DPA, and the Customer&apos;s configuration and use of the
        Services), unless required otherwise by law (in which case Vozpar informs the Customer where lawful).
      </p>

      <h2>2. Subject-Matter, Duration and Details (Annex I)</h2>
      <ul>
        <li>
          <strong>Subject-matter:</strong> provision of the AI voice-agent Services (answering, recording, transcribing,
          routing, analytics).
        </li>
        <li>
          <strong>Personal data:</strong> caller/called numbers, call detail records, recordings, transcripts,
          AI-interaction data, contact records.
        </li>
        <li>
          <strong>Data subjects:</strong> the Customer&apos;s callers, contacts, and end-customers.
        </li>
        <li>
          <strong>Duration:</strong> the term of the MSA. Retention: per Customer configuration and applicable law;
          otherwise deletion/return on termination.
        </li>
      </ul>

      <h2>3. Processor Obligations</h2>
      <ul>
        <li>process only on documented instructions; flag instructions that appear to breach data-protection law;</li>
        <li>ensure authorised persons are bound by confidentiality;</li>
        <li>implement the Annex II security measures (GDPR Art. 32);</li>
        <li>assist the Customer with data-subject requests, security, breach notification, and DPIAs (Arts. 32–36);</li>
        <li>
          notify the Customer without undue delay and, where feasible, within 24 hours of becoming aware of a personal
          data breach affecting Customer Personal Data;
        </li>
        <li>
          on termination, delete or return Customer Personal Data within 30 days and confirm in writing, except where law
          requires retention;
        </li>
        <li>
          make available compliance information and allow audits on 30 business days&apos; notice (or provide an ISO 27001
          / SOC 2 report in lieu); maintain Art. 30(2) records.
        </li>
      </ul>

      <h2>4. Customer Obligations</h2>
      <p>
        The Customer must have a lawful basis and provide all notices/obtain all consents for the data processed through
        the Services (including for recording, AI voice, and any outbound/telemarketing under the TCPA/ePrivacy/local
        law), and must not instruct unlawful processing.
      </p>

      <h2>5. Sub-Processors</h2>
      <p>
        The Customer authorises Vozpar to engage the sub-processors in the{" "}
        <Link href="/subprocessors">Sub-Processor List</Link> (hosting, AI/ASR/TTS, payments, communications). Vozpar
        imposes equivalent terms, remains responsible for them, gives at least 14 days&apos; notice of changes, and allows
        objection on reasonable data-protection grounds.
      </p>

      <h2>6. International Transfers</h2>
      <p>
        For transfers of Customer Personal Data from the EEA/UK to a country without an adequacy decision, the EU SCCs
        (Decision 2021/914), Module Two (Controller-to-Processor), and the UK IDTA/Addendum apply, completed with the
        Annex I details. Vozpar, in Singapore, also complies with the PDPA Transfer Limitation Obligation. Transfer
        impact assessments are conducted for third-country sub-processors.
      </p>

      <h2>7. Jurisdiction-Specific Terms</h2>
      <ul>
        <li>
          <strong>United States — CCPA/CPRA:</strong> Vozpar is a &ldquo;service provider&rdquo;, not a &ldquo;third
          party&rdquo;; it will not sell/share Customer Personal Data or use it outside the direct business relationship,
          and binds sub-processors equivalently.
        </li>
        <li>
          <strong>Brazil — LGPD:</strong> Vozpar acts as operator (operador); transfers and security follow the LGPD;
          assists with ANPD requests.
        </li>
        <li>
          <strong>Other Latin American countries:</strong> Vozpar applies equivalent processor obligations under
          applicable national data-protection law.
        </li>
      </ul>

      <h2>8. Annex II — Security Measures (GDPR Art. 32)</h2>
      <ul>
        <li>
          <strong>Encryption</strong> — TLS 1.2+ in transit, SRTP for media, AES-256 at rest for recordings/transcripts;
          no unencrypted transmission.
        </li>
        <li>
          <strong>Access control</strong> — MFA, role-based access, unique accounts, quarterly access reviews, immediate
          revocation on role change.
        </li>
        <li>
          <strong>Monitoring &amp; logging</strong> — continuous monitoring, intrusion detection, tamper-evident audit
          logs ≥12 months, tested incident response.
        </li>
        <li>
          <strong>Infrastructure</strong> — ISO 27001-certified data centres, physical controls, encrypted backups,
          tested disaster recovery.
        </li>
        <li>
          <strong>Personnel &amp; vendors</strong> — confidentiality obligations and security training; vendor due
          diligence on sub-processors.
        </li>
        <li>
          <strong>Secure development</strong> — secure SDLC, code review, annual penetration testing, vulnerability/patch
          management, data minimisation/pseudonymisation.
        </li>
      </ul>

      <h2>9. Liability, Term and Governing Law</h2>
      <p>
        This DPA supplements the MSA and prevails on data-processing matters. Governed by the laws of Singapore, except
        that EU SCC disputes are governed as the SCCs specify. Business customers needing a signed DPA may contact{" "}
        <a href="mailto:legal@Vozpar">legal@Vozpar</a>.
      </p>

      <h2>Contact</h2>
      <ul>
        <li><strong>Legal:</strong> <a href="mailto:legal@Vozpar">legal@Vozpar</a></li>
        <li><strong>Privacy:</strong> <a href="mailto:privacy@Vozpar">privacy@Vozpar</a></li>
        <li><strong>DPO:</strong> <a href="mailto:dpo@Vozpar">dpo@Vozpar</a></li>
      </ul>
      <p>Rozper, 46 Shopping Plaza, Unit #5092 Chagrin Falls, OH 44022.</p>
    </LegalPage>
  )
}
