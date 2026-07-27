import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"

export const metadata: Metadata = pageSeo({
  title: "Privacy Policy",
  description:
    "How Vozpar collects, uses, safeguards, and discloses information arising from your use of the Vozpar AI voice agent platform.",
  path: "/privacy",
})

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(220,38,38,0.10),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="relative mx-auto w-full max-w-4xl px-4 py-12 text-center md:px-6 md:py-16">
          <ScrollReveal>
            <span className="ai-pill-magenta">
              <span className="h-1 w-1 rounded-full bg-accent" />
              Legal
            </span>
            <h1 className="mt-6 text-balance text-4xl font-serif font-normal tracking-tight md:text-6xl">
              Privacy <span className="text-primary">Policy.</span>
            </h1>
            <p className="mt-5 text-sm text-muted-foreground">Last updated on 24 June 2026</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Body */}
      <article className="legal mx-auto w-full max-w-3xl px-4 py-10 md:px-6 md:py-12">
        <p>
          Welcome to Vozpar. This Privacy Policy explains how Vozpar (&ldquo;us,&rdquo;
          &ldquo;we,&rdquo; &ldquo;our,&rdquo; &ldquo;Vozpar&rdquo;), which operates
          the Vozpar platform, collects, uses, safeguards, and discloses information arising from your use of our
          services. This includes our website (www.Vozpar), our customer dashboard and self-hosted control panel
          (voice.Vozpar), our APIs, and our AI voice agent, telephony, and related products and services
          (collectively, the &ldquo;Services&rdquo;).
        </p>

        <h2 id="introduction">1. Introduction and Scope</h2>
        <p>
          Vozpar provides software that lets businesses build, launch, and scale AI voice agents that handle inbound
          and outbound phone calls. Our platform connects to the carrier account you already use, runs an audio-native
          conversational engine, and can answer questions from your own knowledge base.
        </p>
        <p>
          Our commitment is to protect your privacy and ensure the security of your personal information. This Privacy
          Policy applies to all users of our Services worldwide and governs your visit to our website and use of our
          Services. By accessing or using our Services, you agree to the terms of this Privacy Policy. If you do not
          agree with this Privacy Policy, you should not use our Services or engage with our website.
        </p>
        <p>
          If you have additional questions or require more information about this Privacy Policy, please contact us at{" "}
          <a href="mailto:support@Vozpar">support@Vozpar</a>.
        </p>

        <h2 id="information-we-collect">2. Information We Collect</h2>
        <p>
          We collect several types of information for various purposes, to provide and improve our Services. We obtain
          information when you visit our website, contact us, create an account, build or operate an AI voice agent,
          place or receive calls through the Services, or download data about your account.
        </p>

        <h3>2.1 Personal Information You Provide to Us</h3>
        <p>We collect personal information that you voluntarily provide when you:</p>
        <ul>
          <li>Register for an account on our website, dashboard, or app.</li>
          <li>Express interest in obtaining information about us or our Services.</li>
          <li>Purchase voice credit, top-ups, or other services.</li>
          <li>Build, configure, or operate an AI voice agent.</li>
          <li>
            Submit content to be used by your agent (for example, prompts, knowledge bases, FAQs, or product
            documentation).
          </li>
          <li>Participate in activities on the Services (e.g., demos, contests, newsletters).</li>
          <li>Contact us for support, sales, or other inquiries.</li>
        </ul>
        <p>The personal information we collect may include:</p>
        <ul>
          <li>
            <strong>Contact and Account Information:</strong> Name, email address, phone number, mobile number, billing
            details, company name, and account credentials.
          </li>
          <li>
            <strong>Payment Information:</strong> Credit/debit card or other payment details necessary to process your
            voice-credit top-ups and purchases, handled securely by our third-party payment processing partners. We do
            not store full payment card numbers on our own servers.
          </li>
          <li>
            <strong>Know Your Customer (KYC) and Verification Information:</strong> In certain situations, due to service
            or regulatory requirements (for example, telecommunications and anti-fraud compliance), we may require
            identity verification. This may involve submitting supporting documentation, such as government-issued
            identification, business registration, or proof of address. Some verification processes may be handled by
            third-party service providers, whose privacy policies also apply.
          </li>
          <li>
            <strong>Agent Configuration and Content:</strong> System prompts, personas, guardrails, conversation flows,
            and the documents, FAQs, or knowledge-base content you connect to your agent. This content may contain
            personal information that you choose to include.
          </li>
          <li>
            <strong>Communications:</strong> Information you provide when contacting our sales, support, or other teams,
            including records and copies of your correspondence.
          </li>
          <li>
            <strong>Feedback and Testimonials:</strong> If you provide feedback or submit reviews/testimonials, we may
            collect and use this information, including your name, photo (if provided), and position, for marketing
            purposes, with your consent where required.
          </li>
        </ul>

        <h3>2.2 Information Collected Automatically</h3>
        <p>
          When you visit, use, or navigate our Services, we may automatically collect certain information that does not
          typically reveal your specific identity but may include:
        </p>
        <ul>
          <li>
            <strong>Device Information:</strong> IP address, device type, browser type and characteristics, operating
            system, language preferences, device settings, unique device identifiers, and device name.
          </li>
          <li>
            <strong>Usage Information:</strong> Details of your interactions with our Services, such as access times,
            pages viewed, links clicked, features used, referring URLs, country, and approximate location. This
            information is primarily used to maintain the security and operation of our Services and for internal
            analytics and reporting.
          </li>
          <li>
            <strong>Call Detail Records (CDRs):</strong> For calls placed or received through the Services, we and/or
            your carrier collect records that may include the calling number, the number dialed, time of day, call
            duration, and routing and quality metadata.
          </li>
          <li>
            <strong>Call Audio and Transcripts:</strong> Because our platform runs an audio-native voice engine, calls
            handled by your AI voice agent may be processed as audio and/or transcribed in real time so the agent can
            understand and respond. Where you enable call recording, transcription, or conversation logging, we store
            the resulting audio, transcripts, and derived data (such as sentiment and intent signals) and make them
            available to you and to authorized Vozpar support personnel through a secured portion of the platform. For
            diagnosing call-quality issues, we may temporarily process or record call audio for troubleshooting, which
            is deleted after the troubleshooting period.
          </li>
          <li>
            <strong>Conversation Analytics:</strong> Derived signals such as detected language, sentiment, intent, and
            outcome that help operate, measure, and improve your agents.
          </li>
          <li>
            <strong>Cookies and Similar Tracking Technologies:</strong> We use cookies, web beacons, and pixels to
            collect and store information to tailor website experiences, improve our Services, and provide customized
            information. You can configure your browser to remove or reject cookies, though this may affect certain
            features. See Section 9 for details.
          </li>
        </ul>

        <h3>2.3 Information from Third-Party Sources</h3>
        <p>We may collect personal information from third parties and other sources, such as:</p>
        <ul>
          <li>
            <strong>Carrier and Telephony Partners:</strong> Information necessary to route, connect, and bill calls
            through the carrier account you connect to the Services.
          </li>
          <li>
            <strong>Affiliate Partners and Integrated Services:</strong> Information from partners, resellers, or
            services (such as CRMs, calendars, or knowledge sources) that you integrate with our platform.
          </li>
          <li>
            <strong>Advertisers and Analytics Providers:</strong> Data from advertising and analytics networks to
            support and measure our marketing efforts.
          </li>
          <li>
            <strong>Publicly Available Sources:</strong> Information from public sources, such as your professional
            profile, that we believe is relevant to your use of our Services.
          </li>
        </ul>
        <p>
          Information collected from third parties is combined with data collected through our Services and treated as
          personal information per this Privacy Policy.
        </p>

        <h3>2.4 Information Collected on Behalf of Our Customers (Caller Data)</h3>
        <p>
          If you are an individual who calls, or is called by, an AI voice agent that one of our customers operates
          using the Services, that customer is responsible for the information collected from you during the call. Our
          customers act as the controller of that information and must provide appropriate notice to, and obtain any
          required consent from, the individuals their agents interact with — including notice about call recording
          where applicable.
        </p>
        <p>
          In these cases, Vozpar generally acts as a processor or service provider, processing call audio,
          transcripts, and related data on the customer&apos;s behalf and under their instructions. We do not use this
          caller data for our own independent purposes except as necessary to provide, secure, and maintain the
          Services, or as required by law.
        </p>

        <h3>2.5 Free Tools and Live Demos</h3>
        <p>
          When you use our live demo or any free tools we offer, the information you provide may be processed during
          your active session to demonstrate the Services. Demo call audio and related data are used to operate the
          demo and may be retained only as needed for security, abuse prevention, and improving the Services, after
          which it is deleted or anonymized.
        </p>

        <h2 id="how-we-use">3. How We Use Your Personal Information</h2>
        <p>
          We use your personal information for purposes based on legitimate business interests, the performance of our
          contract with you, compliance with legal obligations, and/or your consent. We indicate the specific
          processing grounds where appropriate. The ways we use your personal information include:
        </p>

        <h3>3.1 To Provide and Manage Our Services</h3>
        <ul>
          <li>To set up and manage your account and self-hosted control panel.</li>
          <li>To build, configure, run, and scale your AI voice agents.</li>
          <li>
            To process voice-credit top-ups and deliver requested services, including routing inbound and outbound
            calls through your connected carrier.
          </li>
          <li>To enable agents to answer from your connected knowledge base and integrations.</li>
          <li>To provide customer support and respond to inquiries and requests.</li>
          <li>For billing, credit management, and collection purposes.</li>
        </ul>

        <h3>3.2 To Improve and Enhance Our Services</h3>
        <ul>
          <li>
            To understand how users and callers interact with our Services in order to enhance functionality, voice
            quality, latency, and user experience.
          </li>
          <li>To analyze preferences, usage trends, and conversation outcomes, and to improve features.</li>
          <li>To personalize the Services according to user preferences.</li>
          <li>For internal analytics and reporting.</li>
        </ul>

        <h3>3.3 To Communicate with You</h3>
        <ul>
          <li>
            To send announcements, updates, service-related communications, and administrative messages (e.g., account
            management, billing, security alerts, legal compliance).
          </li>
          <li>
            To send marketing and promotional materials if you have shown interest or agreed to receive such
            communications. You can opt out at any time.
          </li>
          <li>To request feedback on our Services.</li>
          <li>
            To contact you by phone, email, or message for support, sales, or other business purposes if you provide
            your details for these reasons.
          </li>
        </ul>

        <h3>3.4 For Security and Fraud Prevention</h3>
        <ul>
          <li>To maintain the security and operation of our Services.</li>
          <li>
            To protect your account, your agents, and our Services from unauthorized access, abuse, and fraudulent
            activities, including telecommunications fraud.
          </li>
          <li>To detect and prevent violations of our Terms of Service.</li>
        </ul>

        <h3>3.5 For Legal and Compliance Purposes</h3>
        <ul>
          <li>
            To comply with legal obligations, court orders, judicial proceedings, or other legal processes, including
            telecommunications regulations.
          </li>
          <li>
            To respond to lawful requests from public authorities, including to meet national security or law
            enforcement requirements.
          </li>
          <li>To exercise, establish, or defend our legal rights.</li>
          <li>To protect your vital interests or those of another person.</li>
        </ul>
        <p>
          Even after account cancellation or expiration, you may receive certain communications from our sales and
          marketing teams, which you can opt out of.
        </p>

        <h2 id="how-we-share">4. How We Share Your Information</h2>
        <p>
          We do not sell, trade, or distribute your personal information to third parties for their own use without your
          consent, except as described in this Privacy Policy or as permitted by law. We may share your personal
          information in the following circumstances:
        </p>

        <h3>4.1 With Service Providers and Partners</h3>
        <p>
          We share information with third-party service providers who perform services on our behalf, such as payment
          processors, cloud hosting and infrastructure providers, AI and speech-processing providers, data analysis
          providers, analytics services, and customer support tools. We limit access to your information, providing only
          what is necessary for them to perform their services, and they are obligated to maintain confidentiality.
        </p>
        <ul>
          <li>
            <strong>Carrier and Telephony Providers:</strong> To connect, route, and bill calls, we exchange the
            information required with the carrier and telephony providers you connect to the Services. Phone numbers and
            call charges generally remain billed directly by your existing carrier.
          </li>
          <li>
            <strong>Payment Details:</strong> Our payment processing partners securely store and process payment
            details, which are not shared externally for other purposes.
          </li>
        </ul>

        <h3>4.2 With Group Companies</h3>
        <p>
          We may share your information with our affiliated or group companies for operational purposes, where
          applicable, subject to this Privacy Policy.
        </p>

        <h3>4.3 For Business Transfers</h3>
        <p>
          We may share or transfer your information in connection with, or during negotiations of, any merger, sale of
          company assets, financing, or acquisition of all or a portion of our business to another company. If we are
          involved in a bankruptcy proceeding, your information may be transferred to the acquirer.
        </p>

        <h3>4.4 For Legal Requirements and Protection</h3>
        <p>
          We may disclose your information if required by law, subpoena, search warrant, court order, or other valid
          legal process, or to:
        </p>
        <ul>
          <li>
            Comply with requests from government agencies, public authorities, or law enforcement, including to meet
            national security or law enforcement requirements.
          </li>
          <li>
            Exercise, establish, or defend our legal rights, or protect against fraud, misuse, and unlawful acts.
          </li>
          <li>
            Protect your vital interests, or the vital interests, rights, property, or safety of Vozpar, our users,
            callers, or the general public.
          </li>
        </ul>

        <h3>4.5 With Your Consent</h3>
        <p>We may disclose your personal information for any other purpose with your consent.</p>

        <h3>4.6 Aggregated or Anonymized Data</h3>
        <p>
          We may create and share aggregated or anonymized data that does not directly identify you with third parties
          for research, benchmarking, marketing, or other purposes.
        </p>

        <h3>4.7 At Your Direction</h3>
        <p>
          When you connect integrations (such as a CRM, calendar, or knowledge source) to your agent, information flows
          to and from those services at your direction and is subject to their privacy policies.
        </p>
        <p>
          We aim to minimize sharing your personal information, disclosing it only as needed for legitimate business
          purposes or as legally required, and we require service providers to protect your data.
        </p>

        <h2 id="security-retention">5. Data Security and Retention</h2>
        <h3>5.1 Data Security</h3>
        <p>
          We implement appropriate technical and organizational security measures, including encryption in transit
          (such as Secure Socket Layer (SSL)/TLS) and access controls, to protect your personal information from
          unauthorized access, use, disclosure, alteration, or destruction. Because the Vozpar control panel is
          self-hosted, you also play an important role in securing the environment, credentials, and integrations under
          your control.
        </p>
        <p>
          No method of transmission over the Internet or electronic storage is 100% secure. While we strive to use
          commercially acceptable means to protect your personal information, we cannot guarantee absolute security.
        </p>
        <h3>5.2 Data Retention</h3>
        <p>
          We retain your personal information only for as long as necessary to fulfill the purposes for which it was
          collected, including providing the Services, complying with legal obligations, resolving disputes, and
          enforcing agreements.
        </p>
        <ul>
          <li>
            <strong>Account Data:</strong> Retained as long as there is a legitimate business reason, such as providing
            services or meeting legal obligations.
          </li>
          <li>
            <strong>Voice Credit and Account Expiration/Cancellation:</strong> Voice credit is valid for a limited
            period from purchase (as stated at checkout and in our pricing terms). If your account or subscription
            expires or is cancelled, associated data — including remaining credit, agents, logs, recordings, and
            transcripts — may be deleted on or after the expiry or next billing date, in line with our defined
            data-deletion timeline, generally with no recovery option once deleted.
          </li>
          <li>
            <strong>Fraudulent Activities:</strong> Accounts involved in fraudulent or abusive activities may face
            permanent suspension, and we are not liable for resulting data loss.
          </li>
          <li>
            <strong>Call Recordings and Transcripts:</strong> Retained for the period you configure (where you opt in).
            Diagnostic recordings are deleted after the troubleshooting period.
          </li>
          <li>
            <strong>Call Detail Records (CDRs):</strong> Retained for the duration of the account or as required by law
            or for legitimate business purposes.
          </li>
          <li>
            <strong>Demo and Free Tools Data:</strong> Retained only as needed for security and improvement, then
            deleted or anonymized.
          </li>
        </ul>
        <p>When data is no longer needed, we delete or anonymize it where possible and appropriate.</p>

        <h2 id="your-rights">6. Your Rights and Choices</h2>
        <p>
          Depending on your location and applicable law (e.g., the EU/UK GDPR, the CCPA/CPRA, and other applicable data
          protection laws), you may have the following rights regarding your personal information:
        </p>
        <h3>6.1 Right to Access and Correction</h3>
        <p>
          You may access and request correction of inaccurate or incomplete personal information. You can often review
          and edit account information in your account settings or by contacting us.
        </p>
        <h3>6.2 Right to Deletion (Right to be Forgotten)</h3>
        <p>
          You may request deletion of your personal information, subject to legal or business retention requirements
          (e.g., for compliance, accounting, or fraud prevention). Contact us to request deletion.
        </p>
        <h3>6.3 Right to Restrict or Object to Processing</h3>
        <p>You may limit or object to the processing of your personal data in certain circumstances.</p>
        <h3>6.4 Right to Data Portability</h3>
        <p>
          You may request the transfer of your personal data to another organization or to you in a structured,
          commonly used, and machine-readable format.
        </p>
        <h3>6.5 Right to Withdraw Consent</h3>
        <p>
          If we process your data based on consent, you may withdraw it at any time. Withdrawal does not affect prior
          processing or processing based on other lawful grounds.
        </p>
        <h3>6.6 Right to Opt-Out of Marketing Communications</h3>
        <p>
          You can opt out of promotional communications by following the unsubscribe instructions, adjusting
          preferences in your account, or contacting us. You cannot unsubscribe from essential service-related or
          administrative messages.
        </p>
        <h3>6.7 CCPA/CPRA Rights (for California Consumers)</h3>
        <p>
          Where applicable, California consumers have rights including the right to know the categories and specific
          pieces of personal data collected, the right to deletion, the right to correction, and the right to opt out of
          the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal information. We do not sell your personal
          information.
        </p>
        <h3>6.8 GDPR Rights (for EU/UK Individuals)</h3>
        <p>
          Where applicable, the GDPR provides rights to access, rectify, erase, restrict processing, data portability,
          and object to processing. For customers who use the Services to process personal data of individuals in the
          EU/UK, we can make available a Data Processing Addendum (DPA).
        </p>
        <p>
          To exercise these rights, contact us using the details in Section 13. Requests typically receive a response
          within one month, or as otherwise required by law.
        </p>

        <h2 id="international-transfers">7. International Data Transfers</h2>
        <p>
          As a global service, your information may be transferred to, stored, and processed in countries other than
          your own, including the locations where we, our affiliates, or our service providers operate. These countries
          may have different data protection laws.
        </p>
        <p>
          By using the Services and submitting information, you acknowledge such transfers. Where required, we put in
          place appropriate safeguards — such as standard contractual clauses or reliance on adequacy decisions — in
          accordance with applicable data protection laws.
        </p>

        <h2 id="childrens-privacy">8. Children&apos;s Privacy</h2>
        <p>
          Our Services are not intended for individuals under 18 (or the age of majority in their jurisdiction). We do
          not knowingly collect personal information from children under this age. If you believe a child has provided
          personal information without appropriate consent, contact us immediately and we will promptly remove such
          information.
        </p>

        <h2 id="cookies">9. Cookies and Tracking Technologies; Do-Not-Track</h2>
        <h3>9.1 Cookies and Similar Technologies</h3>
        <p>
          We use cookies, web beacons, and pixels to track activity and store information to enhance the user experience
          and tailor the Services. Cookies are small data files that may include an anonymous unique identifier. You can
          configure your browser to reject cookies, but this may affect certain features.
        </p>
        <h3>9.2 Do-Not-Track (DNT)</h3>
        <p>
          We do not currently respond to DNT browser signals, as no uniform standard exists. If a standard is adopted,
          we will update this Privacy Policy accordingly.
        </p>

        <h2 id="third-party-links">10. Third-Party Links and Services</h2>
        <p>
          Our Services may contain links to, or integrations with, third-party websites or services not owned or
          controlled by Vozpar. These third parties have their own privacy policies, and we are not responsible for
          their practices or content. Review their privacy policies before sharing personal information. Interactions
          through integrated third-party platforms (e.g., carriers, CRMs, calendars, or support tools) are subject to
          their privacy policies.
        </p>

        <h2 id="changes">11. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy to reflect changes in our practices or for legal, operational, or regulatory
          reasons. Updates are effective immediately upon posting on our Services (e.g., www.Vozpar). We will notify
          you of significant changes via the Service, website, or email (if available). Continued use after changes
          implies acceptance, except for new processing that requires consent.
        </p>

        <h2 id="communication-channels">12. Communication Channels</h2>
        <p>Our official communication channels include:</p>
        <ul>
          <li>
            <strong>Email:</strong> Using official Vozpar domains (e.g., support@Vozpar and sales@Vozpar).
          </li>
          <li>
            <strong>Website:</strong> www.Vozpar.
          </li>
          <li>
            <strong>Customer Dashboard:</strong> voice.Vozpar.
          </li>
        </ul>
        <p>
          Data shared through these channels is processed per this Privacy Policy. Be cautious of communications from
          unofficial sources, and contact our support team via our website if you are unsure about authenticity. We may
          update these channels and will notify users through existing official channels.
        </p>

        <h2 id="contact">13. Contact Us</h2>
        <p>For questions, concerns, or to exercise your rights, contact us at:</p>
        <ul>
          <li>
            <strong>Company Name:</strong> Vozpar
          </li>
          <li>
            <strong>Address:</strong> 46 Shopping Plaza, Unit #5092 Chagrin Falls, OH 44022
          </li>
          <li>
            <strong>Support Email:</strong> <a href="mailto:support@Vozpar">support@Vozpar</a>
          </li>
          <li>
            <strong>Sales &amp; Partnerships:</strong> <a href="mailto:sales@Vozpar">sales@Vozpar</a>
          </li>
          <li>
            <strong>Voice:</strong> <a href="tel:+13474744009">+1 347-474-4009</a>
          </li>
        </ul>

        <h2 id="consent">14. Consent</h2>
        <p>
          By using our website (www.Vozpar) and Services, you consent to this Privacy Policy and agree to its terms. If
          you do not agree, please <Link href="/contact">contact us</Link> or discontinue use of the Vozpar platform.
        </p>
      </article>

      <SiteFooter />
    </main>
  )
}
