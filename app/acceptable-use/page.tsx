import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage } from "@/components/legal/legal-page"
import { pageSeo } from "@/lib/seo"

export const metadata: Metadata = pageSeo({
  title: "Acceptable Use Policy",
  description:
    "The rules for using 9278.ai AI voice agents lawfully — calling and texting compliance (TCPA, CAN-SPAM, 10DLC, STIR/SHAKEN, ePrivacy), AI-voice disclosure, recording consent, and prohibited conduct.",
  path: "/acceptable-use",
})

export default function AcceptableUsePage() {
  return (
    <LegalPage title="Acceptable Use" accent="Policy." name="Acceptable Use Policy" path="/acceptable-use">
      <p>
        This Acceptable Use Policy (&ldquo;AUP&rdquo;) is part of the <Link href="/terms">Master Services Agreement</Link>.
        It applies to you, your users, and any AI agent you configure. Breach can lead to suspension or termination
        without refund and to reporting where the law requires. Examples below are not exhaustive.
      </p>

      <h2>1. Definitions</h2>
      <ul>
        <li>
          <strong>Robocall / robotext</strong> — a call or message made with an automatic dialing system,
          prerecorded/artificial voice, or AI-generated voice/text, without the consent required by law.
        </li>
        <li>
          <strong>Spam</strong> — unsolicited commercial messaging in bulk or without consent, breaching anti-spam or
          telemarketing law.
        </li>
        <li>
          <strong>AI-generated content</strong> — voice, text, or audio produced or materially altered by AI, including
          voice cloning and deepfake audio.
        </li>
      </ul>

      <h2>2. Calling and Texting Rules</h2>
      <p>
        You and your users must follow the laws governing calls and messages in every jurisdiction you contact. You must
        not:
      </p>
      <ul>
        <li>
          make illegal robocalls/robotexts or use autodialing, predictive dialing, or prerecorded/AI voice where
          forbidden or without the consent required (e.g. US TCPA and the FCC&apos;s 2024 ruling that AI-voice calls
          require TCPA consent);
        </li>
        <li>
          conduct telemarketing without required consent, outside permitted calling hours, or to numbers on the US
          National DNC, your internal DNC, or equivalents;
        </li>
        <li>
          breach the US TCPA or CAN-SPAM, mobile-carrier messaging rules, or A2P 10DLC brand/campaign registration;
        </li>
        <li>
          in the EU/UK, send marketing calls/messages contrary to the ePrivacy rules (PECR in the UK) without the
          required consent or lawful basis;
        </li>
        <li>
          in Latin America, breach local telemarketing/consumer rules and the LGPD or other privacy laws&apos; consent
          requirements;
        </li>
        <li>spoof or falsify caller ID, or evade caller-ID authentication (STIR/SHAKEN), traceback, or robocall mitigation;</li>
        <li>fail to honour opt-out/STOP requests promptly, or keep inaccurate consent/DNC records.</li>
      </ul>

      <h2>3. AI Voice — Disclosure and Conduct</h2>
      <p>
        Your AI agent must clearly disclose to callers that they are interacting with an automated/AI system, not a
        human, and (where calls are recorded) that the call is recorded. You must not use AI voice to impersonate a
        specific real person or to create deceptive/deepfake audio. See the{" "}
        <Link href="/ai-disclosure">AI Voice Disclosure &amp; Responsible-AI Policy</Link>. The US FCC treats AI-voice
        robocalls as subject to TCPA consent and the FTC prohibits deceptive AI voice; the EU AI Act requires disclosure
        of AI interactions and AI-generated content.
      </p>

      <h2>4. Recording and Monitoring — Your Responsibility</h2>
      <p>
        The platform can record and monitor calls and transcribe interactions. You must obtain every consent and give
        every notice the law requires (US federal one-party consent, but many states require all-party consent; EU/UK
        GDPR; LATAM national laws). See the <Link href="/recording-notice">Recording &amp; Monitoring Notice</Link>.
        Unlawful recording can be a criminal offence.
      </p>

      <h2>5. Prohibited Content and Conduct</h2>
      <p>You must not use the Services to:</p>
      <ul>
        <li>harass, threaten, defraud, deceive, or impersonate any person or organisation;</li>
        <li>distribute malware, run phishing/vishing/scams, or attempt unauthorised access to any system;</li>
        <li>
          transmit unlawful content, content that sexually exploits or endangers children, or incitement to violence or
          unlawful discrimination;
        </li>
        <li>misuse personal data obtained through the Services incompatibly with the purpose collected;</li>
        <li>evade lawful interception, sanctions, or export controls, or contact destinations you are barred from contacting.</li>
      </ul>

      <h2>6. Service Integrity and Fraud</h2>
      <p>
        Do not resell except as your plan permits; place artificial, fraudulent, or traffic-pumping traffic; share one
        account to evade limits; or degrade the Services for others. 9278.ai runs fraud and toll-fraud monitoring and may
        block suspicious traffic.
      </p>

      <h2>7. Enforcement</h2>
      <p>
        Report abuse to <a href="mailto:abuse@9278.ai">abuse@9278.ai</a>. 9278.ai may investigate, suspend or terminate
        accounts, block traffic, remove content, and cooperate with carriers, regulators, and law enforcement; for fraud,
        illegal traffic, or safety risks it may act immediately. To appeal, email{" "}
        <a href="mailto:legal@9278.ai">legal@9278.ai</a> with &ldquo;Account Appeal&rdquo;. We may update this AUP on at
        least 30 days&apos; notice for material changes.
      </p>

      <h2>Contact</h2>
      <ul>
        <li><strong>Legal:</strong> <a href="mailto:legal@9278.ai">legal@9278.ai</a></li>
        <li><strong>Privacy:</strong> <a href="mailto:privacy@9278.ai">privacy@9278.ai</a></li>
        <li><strong>Abuse:</strong> <a href="mailto:abuse@9278.ai">abuse@9278.ai</a></li>
        <li><strong>Support:</strong> <a href="mailto:support@9278.ai">support@9278.ai</a></li>
      </ul>
      <p>Ace Peak Invest Pte Ltd (9278.ai), 1 Scotts Road, #24-10, Shaw Centre, Singapore 228208.</p>
    </LegalPage>
  )
}
