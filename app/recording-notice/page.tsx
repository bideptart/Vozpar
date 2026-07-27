import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage } from "@/components/legal/legal-page"
import { pageSeo } from "@/lib/seo"

export const metadata: Metadata = pageSeo({
  title: "Call & Interaction Recording and Monitoring Notice",
  description:
    "Vozpar's recording, live-monitoring, transcription, and call-forwarding features and the consent obligations that apply — US one/all-party states, EU/UK GDPR, and Latin American laws.",
  path: "/recording-notice",
})

export default function RecordingNoticePage() {
  return (
    <LegalPage title="Recording & Monitoring" accent="Notice." name="Call & Interaction Recording and Monitoring Notice" path="/recording-notice">
      <p>
        This Notice explains the recording and monitoring features of the Services and the consent obligations that
        apply when you use them. It supports the <Link href="/terms">MSA</Link>,{" "}
        <Link href="/privacy">Privacy Policy</Link>, <Link href="/acceptable-use">AUP</Link>, and{" "}
        <Link href="/dpa">DPA</Link>. When you use these features you are the controller and Vozpar is your processor;
        the legal duty to record and monitor lawfully is yours.
      </p>

      <h2>1. Features That Capture Interactions</h2>
      <ul>
        <li>
          <strong>Call recording</strong> — recording of inbound/outbound calls handled by your AI agent, retained for
          the period you configure (extendable).
        </li>
        <li>
          <strong>Live monitoring</strong> — supervisor listen, whisper, and barge on live calls (where enabled).
        </li>
        <li>
          <strong>Transcription &amp; AI</strong> — AI transcription, sentiment analysis, and summaries (see the{" "}
          <Link href="/ai-disclosure">AI Voice Disclosure &amp; Responsible-AI Policy</Link>).
        </li>
        <li>
          <strong>Call forwarding</strong> — routing of calls to your human team&apos;s numbers.
        </li>
      </ul>

      <h2>2. Consent — It Varies by Location</h2>
      <p>
        A recording of an identifiable person is personal data. Laws differ and a call can connect people in different
        places. The safe rule Vozpar recommends is to treat every interaction as requiring all-party consent: announce
        recording/monitoring and AI handling at the start and proceed only if participants agree.
      </p>
      <ul>
        <li>
          <strong>United States</strong> — federal one-party consent (18 U.S.C. §2511), but all-party-consent states
          include California, Connecticut, Florida, Illinois, Maryland, Massachusetts, Montana, Nevada, New Hampshire,
          Pennsylvania, and Washington. Breach can be criminal and civil.
        </li>
        <li>
          <strong>United Kingdom &amp; EU</strong> — recording is personal-data processing under GDPR; you need a lawful
          basis and must inform participants.
        </li>
        <li>
          <strong>Brazil &amp; Latin America</strong> — the LGPD and national laws require a lawful basis and notice;
          treat as all-party.
        </li>
      </ul>

      <h2>3. Monitoring Your Own Agents</h2>
      <p>
        Listening to, recording, or monitoring agents is employee monitoring. You must inform agents in advance, have a
        lawful basis (and, in the EU/UK, often complete a balancing test or DPIA), and follow local employment rules.
        Vozpar provides configurable announcements and recording controls; using them does not transfer the legal duty
        to you-as-employer.
      </p>

      <h2>4. How Recordings Are Handled</h2>
      <p>
        Vozpar stores and processes recordings and transcripts on your behalf to provide the feature and secure the
        Services; Vozpar does not sell them. Retention settings let you keep recordings no longer than necessary. On
        account closure, recordings remain available for export for a defined window, then are deleted, unless legal
        retention applies.
      </p>

      <h2>5. AI Processing and Prohibited Use</h2>
      <p>
        Processing a recording with AI (transcription, summarisation, sentiment) is a distinct purpose requiring its own
        lawful basis and disclosure; the EU AI Act adds transparency duties. You must not use recording or AI voice to
        entrap, deceive, impersonate, or capture conversations unlawfully, or to record people under 18 without specific
        legal advice and required consents.
      </p>

      <h2>Contact</h2>
      <ul>
        <li><strong>Privacy:</strong> <a href="mailto:privacy@Vozpar">privacy@Vozpar</a></li>
        <li><strong>Legal:</strong> <a href="mailto:legal@Vozpar">legal@Vozpar</a></li>
        <li><strong>Support:</strong> <a href="mailto:support@Vozpar">support@Vozpar</a></li>
      </ul>
      <p>Rozper, 46 Shopping Plaza, Unit #5092 Chagrin Falls, OH 44022.</p>
    </LegalPage>
  )
}
