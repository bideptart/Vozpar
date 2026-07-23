import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage } from "@/components/legal/legal-page"
import { pageSeo } from "@/lib/seo"

export const metadata: Metadata = pageSeo({
  title: "AI Voice Disclosure & Responsible-AI Policy",
  description:
    "How 9278.ai handles AI-voice disclosure, no impersonation or deepfakes, AI-voice telemarketing consent, human escalation, accuracy limits, and responsible use — reflecting the EU AI Act, FCC, and FTC.",
  path: "/ai-disclosure",
})

export default function AiDisclosurePage() {
  return (
    <LegalPage title="AI Voice Disclosure &" accent="Responsible-AI." name="AI Voice Disclosure & Responsible-AI Policy" path="/ai-disclosure">
      <p>
        This Policy supplements the <Link href="/terms">Terms</Link>,{" "}
        <Link href="/acceptable-use">AUP</Link>, <Link href="/privacy">Privacy Policy</Link>, and{" "}
        <Link href="/dpa">DPA</Link> and applies to every AI voice agent built on 9278.ai. It reflects the EU AI Act, the
        US FCC&apos;s 2024 AI-voice ruling, the FTC&apos;s prohibition on deceptive AI voice, and comparable Latin
        American consumer-protection expectations.
      </p>

      <h2>1. Disclosure That the Caller Is Interacting with an AI</h2>
      <p>
        Every AI agent must clearly and promptly tell the caller, at the start of the interaction, that they are speaking
        with an automated/AI voice assistant and not a human, and identify the business on whose behalf it operates.
        Under the EU AI Act, providers/deployers must ensure people are informed they are interacting with an AI system.
        The platform provides a configurable opening disclosure; you must keep it enabled and accurate.
      </p>

      <h2>2. No Impersonation or Deceptive / Deepfake Audio</h2>
      <p>
        You must not configure an AI agent to impersonate a specific, identifiable real person, to clone a real
        individual&apos;s voice without their explicit consent, or to deceive callers about the nature of the call.
        AI-generated audio must be capable of being identified as artificially generated where the EU AI Act or other law
        requires, and must not be used to mislead or defraud.
      </p>

      <h2>3. AI-Voice Telemarketing (US TCPA / FCC)</h2>
      <p>
        In the United States, the FCC has ruled that calls using AI-generated or prerecorded voices are subject to TCPA
        prior-express-consent requirements. You must obtain the required consent before any AI-voice outbound or
        marketing call and honour do-not-call and revocation rules. The FTC prohibits deceptive or unfair AI-voice
        practices.
      </p>

      <h2>4. Human Escalation</h2>
      <p>
        Where a caller asks to speak to a human, or the matter is sensitive (complaints, financial/medical/legal
        decisions, vulnerable callers), the agent should offer escalation or call-back to a human (call forwarding to
        your team).
      </p>

      <h2>5. Accuracy, Grounding and Limits</h2>
      <p>
        AI responses (including retrieval over your documents) can be inaccurate or biased. You are responsible for the
        prompts, knowledge sources, and scripts you deploy, and must not rely on the AI as the sole basis for decisions
        that significantly affect a caller, nor use it to give regulated advice you are not authorised to give.
      </p>

      <h2>6. Consent, Recording and Data</h2>
      <p>
        Calls handled by your AI agent involve collecting personal data and (where enabled) recording. You must obtain
        the consents and give the notices required by GDPR/UK GDPR, US state law, the LGPD or other LATAM laws, and the{" "}
        <Link href="/recording-notice">Recording &amp; Monitoring Notice</Link>. 9278.ai does not use your call content
        to train generative models without your documented consent.
      </p>

      <h2>7. Enforcement</h2>
      <p>
        Misuse of AI voice (impersonation, deepfakes, undisclosed automation, deception, unconsented AI-voice
        telemarketing) is a serious breach and may lead to immediate suspension and reporting to authorities.
      </p>

      <h2>Contact</h2>
      <ul>
        <li><strong>Legal:</strong> <a href="mailto:legal@9278.ai">legal@9278.ai</a></li>
        <li><strong>Privacy:</strong> <a href="mailto:privacy@9278.ai">privacy@9278.ai</a></li>
        <li><strong>Support:</strong> <a href="mailto:support@9278.ai">support@9278.ai</a></li>
      </ul>
      <p>Ace Peak Invest Pte Ltd (9278.ai), 1 Scotts Road, #24-10, Shaw Centre, Singapore 228208.</p>
    </LegalPage>
  )
}
