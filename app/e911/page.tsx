import type { Metadata } from "next"
import { LegalPage } from "@/components/legal/legal-page"
import { pageSeo } from "@/lib/seo"

export const metadata: Metadata = pageSeo({
  title: "Emergency Calling (E911) Notice",
  description:
    "Important safety notice: 9278.ai is an interconnected internet-voice service and is not a replacement for traditional phone service. Emergency calling may be limited or unavailable — always keep an alternative.",
  path: "/e911",
})

export default function E911Page() {
  return (
    <LegalPage title="Emergency Calling" accent="(E911) Notice." name="Emergency Calling (E911) Notice" path="/e911" eyebrow="Safety">
      <p>
        <strong>IMPORTANT SAFETY NOTICE.</strong> The Services are internet-based (interconnected voice) and are not a
        full replacement for traditional or mobile telephone service. Emergency calling may be limited or unavailable, and
        an AI voice agent is not designed to place or handle emergency calls. You and your users must always have an
        alternative means of contacting emergency services.
      </p>

      <h2>1. How Emergency Calling May Differ</h2>
      <ul>
        <li>
          9278.ai may not be able to connect a call to emergency services (911 in the US, 112 in the EU/UK, and local
          equivalents), and may not transmit your location or call-back number.
        </li>
        <li>
          Emergency calling will not work during an internet or power outage, if your device or account is not working,
          or if your service is suspended.
        </li>
        <li>
          Because numbers are nomadic, the registered address may not match your actual location when you call.
        </li>
      </ul>

      <h2>2. Your Responsibilities</h2>
      <ul>
        <li>
          Register and keep current an accurate physical service address for each user/number, so emergency calls route
          to the correct centre (PSAP in the US).
        </li>
        <li>Inform every user and, where relevant, on-site visitors of these limitations.</li>
        <li>Maintain an alternative means (e.g. mobile or landline) of reaching emergency services.</li>
      </ul>

      <h2>3. Acknowledgment</h2>
      <p>
        As required by the FCC for interconnected voice in the US, 9278.ai provides this advisory and obtains an
        affirmative acknowledgment of these 911 limitations at activation. Equivalent obligations apply in other markets.
        Emergency-calling capability varies by country and number type; contact{" "}
        <a href="mailto:support@9278.ai">support@9278.ai</a> for the position in a specific country.
      </p>

      <h2>Contact</h2>
      <ul>
        <li><strong>Support:</strong> <a href="mailto:support@9278.ai">support@9278.ai</a></li>
        <li><strong>Legal:</strong> <a href="mailto:legal@9278.ai">legal@9278.ai</a></li>
      </ul>
      <p>Ace Peak Invest Pte Ltd (9278.ai), 1 Scotts Road, #24-10, Shaw Centre, Singapore 228208.</p>
    </LegalPage>
  )
}
