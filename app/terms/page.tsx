import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo/jsonld"

export const metadata: Metadata = pageSeo({
  title: "Terms of Service",
  description:
    "The Terms of Service governing your use of the 9278.ai AI voice agent platform, operated by Ace Peak Invest Pte Ltd.",
  path: "/terms",
})

export default function TermsOfServicePage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Terms of Service", path: "/terms" },
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
              Terms of <span className="text-primary">Service.</span>
            </h1>
            <p className="mt-5 text-sm text-muted-foreground">Last updated on 24 June 2026</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Body */}
      <article className="legal mx-auto w-full max-w-3xl px-4 py-10 md:px-6 md:py-12">
        <p>
          These Terms of Service (&ldquo;Agreement&rdquo;) govern your access to and use of the 9278.ai platform
          operated by Ace Peak Invest Pte Ltd. Please read them carefully before using the Services.
        </p>

        <h2 id="acceptance">1. Acceptance and Modification of Terms</h2>
        <h3>1.1 Acceptance</h3>
        <p>
          By using the services of Ace Peak Invest Pte Ltd (&ldquo;Services&rdquo;), accessing our customer dashboard
          and self-hosted control panel (voice.9278.ai), using our APIs, browsing our website (www.9278.ai), or clicking
          &ldquo;agree,&rdquo; &ldquo;get started,&rdquo; or a similar button during signup, you acknowledge that you
          have read, understood, and agree to be bound by these Terms of Service (&ldquo;Agreement&rdquo;). Your use of
          the Services is expressly conditioned upon your acceptance of all terms and conditions contained herein.
        </p>
        <h3>1.2 Modification</h3>
        <p>
          Ace Peak Invest Pte Ltd (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our,&rdquo; or &ldquo;9278.ai&rdquo;)
          reserves the right to modify this Agreement at any time, at our sole discretion.
        </p>
        <h3>1.3 Notification of Changes</h3>
        <p>
          We will make reasonable efforts to notify you of any material changes to this Agreement. Such notification may
          include publishing the updated terms on our website or within the dashboard, or, if you have an account,
          sending an email or in-app notification.
        </p>
        <h3>1.4 Effective Date</h3>
        <p>Changes become effective immediately upon posting on our Services, unless otherwise stated.</p>
        <h3>1.5 Consent to Updated Terms</h3>
        <p>Where required, new processing or materially new terms will only apply after we obtain your consent.</p>
        <h3>1.6 Continued Use Constitutes Acceptance</h3>
        <p>
          Your continued use of the Services after changes are posted constitutes your acceptance of the revised
          Agreement.
        </p>
        <h3>1.7 Review Terms Regularly</h3>
        <p>You are responsible for reviewing this Agreement periodically to stay informed of any updates.</p>

        <h2 id="description">2. Description of Services</h2>
        <h3>2.1 General</h3>
        <p>
          9278.ai provides software that lets businesses build, launch, and scale AI voice agents capable of handling
          inbound and outbound phone calls. The platform runs an audio-native conversational engine, supports real
          interruptions and multilingual conversations, and can answer from a knowledge base you connect.
        </p>
        <h3>2.2 Service Provision</h3>
        <p>
          The Services are provided through a self-hosted control panel, web dashboard, and APIs. You are responsible
          for configuring your agents, prompts, guardrails, knowledge sources, and integrations.
        </p>
        <h3>2.3 Service Nature</h3>
        <p>
          9278.ai is a software and connectivity platform. We do not sell phone numbers. Phone numbers, SIP trunks, and
          call termination are provided by the carrier account you connect to the Services, and remain billed by, and
          subject to the terms of, that carrier.
        </p>
        <h3>2.4 Features and Limitations</h3>
        <p>
          Features, capacity (including the number of concurrent agents available on your plan), latency, and language
          coverage may vary and may change over time. We may add, modify, or remove features at our discretion.
        </p>
        <h3>2.5 &ldquo;As Is&rdquo; Provision</h3>
        <p>
          Except as expressly stated in this Agreement, the Services are provided on an &ldquo;as is&rdquo; and
          &ldquo;as available&rdquo; basis. See Section 16.
        </p>
        <h3>2.6 Geographic Availability</h3>
        <p>
          The Services may not be available in all jurisdictions, and availability may depend on your carrier and on
          applicable law. You are responsible for ensuring your use is lawful in your jurisdiction and in any
          jurisdiction you place or receive calls.
        </p>
        <h3>2.7 Service Availability Disclaimer</h3>
        <p>
          We strive for high availability but do not guarantee uninterrupted or error-free operation. Service may be
          affected by maintenance, third-party providers, carriers, or events beyond our control.
        </p>
        <h3>2.8 Service Testing</h3>
        <p>
          We may test, monitor, and diagnose the Services, including by temporarily processing or recording call audio
          for troubleshooting, which is deleted after the troubleshooting period.
        </p>
        <h3>2.9 Third-Party Carriers and Providers</h3>
        <p>
          The Services depend on third-party carriers, telephony, cloud, and AI/model providers. We are not responsible
          for the acts, omissions, outages, or charges of those providers, and your use of them is subject to their
          terms.
        </p>
        <h3>2.10 Data Storage and Backup</h3>
        <p>
          We store account data, agent configurations, logs, and — where you enable them — call recordings and
          transcripts, subject to our Privacy Policy and retention timelines. You are responsible for maintaining your
          own backups of content you consider critical.
        </p>
        <h3>2.11 Call Recording and Transcription</h3>
        <p>
          Where you enable call recording, transcription, or conversation logging, you are solely responsible for
          providing any legally required notices to, and obtaining any required consent from, the individuals your
          agents interact with, in every applicable jurisdiction.
        </p>

        <h2 id="account">3. Account Registration and Management</h2>
        <h3>3.1 Eligibility</h3>
        <p>
          You must be at least 18 years old (or the age of majority in your jurisdiction) and capable of forming a
          binding contract to use the Services. If you use the Services on behalf of an organization, you represent that
          you are authorized to bind that organization.
        </p>
        <h3>3.2 Account Creation</h3>
        <p>
          You must create an account to access most Services. You agree to provide accurate, current, and complete
          information.
        </p>
        <h3>3.3 Information Required</h3>
        <p>
          We may require additional information or identity/business verification (KYC) to comply with
          telecommunications, anti-fraud, or other regulatory requirements. The Services, or specific features, may be
          withheld until verification is complete.
        </p>
        <h3>3.4 Account Security and Responsibility</h3>
        <p>
          You are responsible for safeguarding your credentials, your self-hosted environment, and all activity that
          occurs under your account. Notify us promptly of any unauthorized use.
        </p>
        <h3>3.5 Account Ownership</h3>
        <p>
          The account belongs to the legal person who registered it or on whose behalf it was registered. You may not
          transfer your account without our consent.
        </p>
        <h3>3.6 Third-Party Logins and Integrations</h3>
        <p>
          If you connect third-party services (such as a carrier, CRM, calendar, or knowledge source), you authorize us
          to access and exchange data with those services as needed to provide the Services, subject to their terms.
        </p>
        <h3>3.7 Activation</h3>
        <p>
          Account and agent activation is typically immediate, but may be delayed where verification or carrier
          documentation is required.
        </p>

        <h2 id="duration">4. Service Duration and Renewal</h2>
        <h3>4.1 Term</h3>
        <p>This Agreement applies for as long as you use the Services or maintain an account.</p>
        <h3>4.2 Voice Credit and Top-Ups</h3>
        <p>
          The Services operate on a prepaid voice-credit model. There are no long-term contracts or minimum commitments
          beyond your chosen top-up. Voice credit is valid for the period stated at purchase (currently 60 days from
          purchase) and expires thereafter.
        </p>
        <h3>4.3 No Automatic Renewal of Credit</h3>
        <p>
          Voice credit does not automatically renew. You choose when to top up. Where you opt in to any auto-recharge
          feature, you authorize us to charge your payment method to maintain a credit balance, and you may disable it
          at any time.
        </p>

        <h2 id="fees">5. Fees, Payments, and Billing</h2>
        <h3>5.1 General Fees</h3>
        <p>
          Use of the Services requires purchasing voice credit. Voice usage is charged on a per-minute basis according
          to your plan tier (currently from $0.15/min on Starter, $0.12/min on Growth, and $0.10/min on Scale). Top-up
          amounts (currently $20, $50, or $100) determine your tier and the number of concurrent AI agents available
          (currently up to 1, 2, or 3 respectively). Current pricing is published at{" "}
          <Link href="/pricing">www.9278.ai/pricing</Link> and forms part of this Agreement.
        </p>
        <h3>5.2 Payment Methods</h3>
        <p>
          You agree to provide a valid payment method and authorize us to charge all applicable fees. By providing a
          payment method, you authorize us to invoice your account for amounts due.
        </p>
        <h3>5.3 Payment Information Storage</h3>
        <p>
          We use third-party payment processors to process and securely store payment information. For your security, we
          do not directly store full payment card details. By using the Services, you consent to the processing of your
          payment information by these processors under their privacy and security practices (typically PCI DSS
          certified).
        </p>
        <h3>5.4 Pricing Changes</h3>
        <p>
          We may change pricing, tiers, or credit terms at our discretion. Changes apply to future purchases and will be
          reflected at <Link href="/pricing">www.9278.ai/pricing</Link>. Credit already purchased is governed by the
          terms in effect at the time of purchase.
        </p>
        <h3>5.5 Usage Billing</h3>
        <p>
          Voice usage is deducted from your credit balance in real time or shortly after each call, based on connected
          call duration and your applicable per-minute rate. Carrier and phone-number charges are billed separately by
          your carrier.
        </p>
        <h3>5.6 No Hidden Fees</h3>
        <p>
          There are no setup fees, contracts, or minimums beyond your top-up. Any taxes are additional as described
          below.
        </p>
        <h3>5.7 Currency</h3>
        <p>Unless otherwise stated, fees are quoted and charged in US dollars.</p>
        <h3>5.8 Insufficient Balance and Non-Payment</h3>
        <p>
          If your credit balance is exhausted or a charge fails, affected Services (including active agents and calls)
          may be suspended or limited until sufficient credit is available.
        </p>
        <h3>5.9 Chargebacks</h3>
        <p>
          You agree to contact us to resolve billing concerns before initiating a chargeback. Chargebacks made in bad
          faith may result in suspension or termination.
        </p>
        <h3>5.10 Credit Expiration</h3>
        <p>
          Unused voice credit expires at the end of its validity period (currently 60 days from purchase) and is not
          recoverable or refundable after expiry.
        </p>
        <h3>5.11 Taxes / VAT</h3>
        <p>
          Fees are exclusive of taxes. You are responsible for any applicable VAT, GST, sales, or similar taxes, which
          may be added to your charges.
        </p>
        <h3>5.12 Refund Policy</h3>
        <p>
          Except where required by applicable law, voice credit and fees are non-refundable. Specific refund
          eligibility, if any, is described at <Link href="/pricing">www.9278.ai/pricing</Link> or our{" "}
          <Link href="/faq">FAQ</Link>.
        </p>

        <h2 id="conduct">6. User Conduct and Restrictions on Use</h2>
        <h3>6.1 Lawful and Ethical Use</h3>
        <p>
          You agree to use the Services only for lawful purposes and in compliance with all applicable laws and
          regulations, including telecommunications, telemarketing, robocall, anti-spam, data protection, and
          consumer-protection laws (for example, where applicable, the TCPA, TSR, GDPR, and analogous laws in the
          jurisdictions where you operate and call).
        </p>
        <h3>6.2 AI Disclosure and Consent</h3>
        <p>
          Where required by applicable law, you must disclose to call participants that they are interacting with an
          automated/AI voice agent, and you must obtain any consent required for automated calling, recording, or
          messaging. You are solely responsible for these disclosures and consents.
        </p>
        <h3>6.3 Prohibited Content and Activities</h3>
        <p>
          You may not use the Services to: make fraudulent, deceptive, harassing, or unsolicited (spam) calls;
          impersonate any person or organization in an unlawful or deceptive manner; transmit unlawful, defamatory,
          abusive, or infringing content; violate the privacy or rights of others; distribute malware; or engage in any
          activity that is illegal or that violates a third party&apos;s rights.
        </p>
        <h3>6.4 Specific Use Restrictions</h3>
        <p>
          You may not resell, sublicense, or commercially exploit the Services except as expressly authorized;
          circumvent usage limits or security measures; or use the Services to build a competing product.
        </p>
        <h3>6.5 Investigation and Enforcement</h3>
        <p>
          We may investigate suspected violations and may suspend, limit, or terminate accounts engaged in prohibited
          conduct. We may cooperate with law enforcement as described in Section 8 and our Privacy Policy.
        </p>
        <h3>6.6 Reporting Violations</h3>
        <p>
          You may report suspected misuse or abuse of the Services to <a href="mailto:support@9278.ai">support@9278.ai</a>.
        </p>
        <h3>6.7 Acceptable Use Policy</h3>
        <p>We may publish and update an Acceptable Use Policy, which forms part of this Agreement when published.</p>

        <h2 id="service-specific">7. Service-Specific Terms</h2>
        <h3>7.1 Bring Your Own Carrier and Numbers</h3>
        <p>
          We do not sell or assign phone numbers. You connect your own carrier account; your numbers, SIP trunks,
          billing, and porting rights remain with your carrier. You are responsible for your carrier relationship,
          compliance, and charges.
        </p>
        <h3>7.2 Number and Routing Responsibility</h3>
        <p>
          You are responsible for configuring inbound and outbound routing and for ensuring you have the right to use
          the numbers you connect to the Services.
        </p>
        <h3>7.3 AI Agent Content and Knowledge Base</h3>
        <p>
          You are responsible for the prompts, personas, guardrails, and knowledge sources you supply, and for ensuring
          your agents&apos; behavior and outputs comply with applicable law. AI-generated responses may be inaccurate;
          you are responsible for reviewing and supervising your agents&apos; performance.
        </p>
        <h3>7.4 Third-Party Platforms and Integrations</h3>
        <p>
          Use of integrations and third-party platforms (carriers, CRMs, calendars, model providers, app stores, etc.)
          is subject to their respective terms, which you are responsible for complying with.
        </p>

        <h2 id="privacy-data">8. Privacy, Data Protection, and Content</h2>
        <h3>8.1 Privacy Policy</h3>
        <p>
          Our collection and use of personal information is described in our <Link href="/privacy">Privacy Policy</Link>
          , which is incorporated into this Agreement.
        </p>
        <h3>8.2 Roles</h3>
        <p>
          For data you process about call participants through your agents, you generally act as the controller and we
          act as a processor/service provider acting on your instructions. Where you process personal data of
          individuals in the EU/UK, a Data Processing Addendum (DPA) is available.
        </p>
        <h3>8.3 Data Security</h3>
        <p>
          We implement appropriate technical and organizational measures to protect data. Because the control panel is
          self-hosted, you are responsible for securing your own environment, credentials, and integrations.
        </p>
        <h3>8.4 User Rights</h3>
        <p>Data-subject rights and your choices are described in our Privacy Policy.</p>
        <h3>8.5 Your Content</h3>
        <p>
          You retain ownership of the content you provide (prompts, knowledge bases, recordings, transcripts, and other
          materials). You grant us a limited license to host, process, and use that content as necessary to provide,
          secure, and improve the Services.
        </p>
        <h3>8.6 Disclosure of Personal Information</h3>
        <p>
          We may disclose information as described in our Privacy Policy, including to comply with legal obligations or
          lawful requests.
        </p>
        <h3>8.7 Cooperation with Investigations and Fraud Prevention</h3>
        <p>
          We may share information as needed to prevent fraud and abuse, and to cooperate with lawful investigations.
        </p>
        <h3>8.8 Monitoring</h3>
        <p>
          We may monitor use of the Services to maintain security, prevent abuse, and ensure compliance with this
          Agreement.
        </p>
        <h3>8.9 Promotional Use of Customer Name/Logo</h3>
        <p>
          With your consent where required, we may identify you as a customer and use your name and logo in marketing
          materials. You may opt out by contacting us.
        </p>
        <h3>8.10 Recording and Messaging Consent</h3>
        <p>
          You are solely responsible for obtaining all consents required for call recording, automated calling, and
          SMS/messaging conducted through your agents.
        </p>

        <h2 id="ip">9. Intellectual Property Rights</h2>
        <h3>9.1 Ownership</h3>
        <p>
          We and our licensors own all rights, title, and interest in the Services, software, platform, and related
          intellectual property (&ldquo;9278.ai Properties&rdquo;), excluding your content.
        </p>
        <h3>9.2 License to You</h3>
        <p>
          Subject to this Agreement, we grant you a limited, non-exclusive, non-transferable, revocable license to
          access and use the Services for your internal business purposes.
        </p>
        <h3>9.3 Restrictions</h3>
        <p>
          You will not: resell, rent, lease, sublicense, distribute, or commercially exploit the Services except as
          expressly permitted; modify, translate, adapt, reverse engineer, decompile, or disassemble any part of the
          Services except as permitted by law; use scrapers, bots, or similar tools to extract data; or remove or
          obscure proprietary notices.
        </p>
        <h3>9.4 No Implied Rights</h3>
        <p>No rights are granted other than those expressly set out in this Agreement.</p>
        <h3>9.5 Future Releases</h3>
        <p>
          We are not obligated to provide updates or new features, and this Agreement applies to any updates we do
          provide.
        </p>
        <h3>9.6 Reservation of Rights</h3>
        <p>All rights not expressly granted are reserved.</p>
        <h3>9.7 Feedback</h3>
        <p>
          If you provide feedback or suggestions, you grant us a perpetual, royalty-free right to use them without
          restriction or obligation to you.
        </p>

        <h2 id="emergency">10. Emergency Services</h2>
        <h3>10.1 No Emergency Calling</h3>
        <p>
          The Services are not intended or designed to support emergency calls (such as 911, 112, 999, or equivalent)
          and must not be relied upon for emergency communications.
        </p>
        <h3>10.2 Recommendation for Alternatives</h3>
        <p>
          You must maintain an alternative means of contacting emergency services (such as a traditional or mobile phone
          line).
        </p>
        <h3>10.3 Disclaimer of Liability</h3>
        <p>
          To the fullest extent permitted by law, we disclaim all liability for any inability to reach emergency
          services through the Services.
        </p>
        <h3>10.4 Notice to Users</h3>
        <p>
          You are responsible for informing your own users and call participants of these limitations where relevant.
        </p>

        <h2 id="termination">11. Termination and Suspension</h2>
        <h3>11.1 Termination by You</h3>
        <p>
          You may stop using the Services and close your account at any time. Unused, expired, or forfeited credit is
          non-refundable except where required by law.
        </p>
        <h3>11.2 Termination or Suspension by Us</h3>
        <p>
          We may suspend or terminate your access, with or without notice, for violation of this Agreement, suspected
          fraud or abuse, non-payment, legal/regulatory reasons, or risk to the Services or others.
        </p>
        <h3>11.3 Effects of Termination</h3>
        <p>
          Upon termination, your right to use the Services ends and associated data — including agents, logs,
          recordings, transcripts, and any remaining credit — may be deleted in accordance with our retention
          timelines, generally with no recovery option.
        </p>
        <h3>11.4 Survival</h3>
        <p>
          Provisions that by their nature should survive termination (including Sections 5, 8, 9, 12, 13, 14, and 15)
          will survive.
        </p>

        <h2 id="liability">12. Limitation of Liability</h2>
        <h3>12.1 General Limitation</h3>
        <p>
          To the fullest extent permitted by law, we and our affiliates, suppliers, and licensors will not be liable for
          any indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits,
          revenues, data, goodwill, or business interruption, arising out of or relating to the Services or this
          Agreement.
        </p>
        <h3>12.2 Aggregate Liability</h3>
        <p>
          To the fullest extent permitted by law, our total aggregate liability arising out of or relating to the
          Services or this Agreement will not exceed the amount you paid to us in the three (3) months immediately
          preceding the event giving rise to the claim.
        </p>
        <h3>12.3 No Liability for Certain Matters</h3>
        <p>
          We are not liable for losses arising from third-party carriers or providers, your configuration of agents, AI
          output accuracy, your or your users&apos; content or conduct, unauthorized account access not caused by us, or
          events beyond our reasonable control.
        </p>
        <h3>12.4 Basis of the Bargain</h3>
        <p>
          The limitations in this Section reflect the allocation of risk between the parties and form an essential basis
          of the bargain.
        </p>

        <h2 id="indemnification">13. Indemnification</h2>
        <h3>13.1 Indemnity Obligation</h3>
        <p>
          You agree to indemnify, defend, and hold harmless 9278.ai (Ace Peak Invest Pte Ltd), its affiliates, and their
          officers, directors, employees, and agents from and against any claims, damages, liabilities, losses, and
          expenses (including reasonable legal fees) arising out of or related to: your use of the Services; your
          content, agents, prompts, or knowledge sources; your calls, recordings, or messaging; your violation of this
          Agreement or applicable law (including telemarketing, recording-consent, and data-protection laws); or your
          infringement of any third-party rights.
        </p>

        <h2 id="disputes">14. Dispute Resolution and Arbitration</h2>
        <h3>14.1 Informal Resolution</h3>
        <p>
          Before initiating formal proceedings, you agree to first contact us at{" "}
          <a href="mailto:support@9278.ai">support@9278.ai</a> and attempt to resolve the dispute informally.
        </p>
        <h3>14.2 Binding Arbitration</h3>
        <p>
          To the extent permitted by applicable law, disputes that cannot be resolved informally will be resolved by
          binding arbitration administered in Singapore in accordance with the rules of the Singapore International
          Arbitration Centre (SIAC), except where prohibited by law.
        </p>
        <h3>14.3 Class Action Waiver</h3>
        <p>
          To the extent permitted by law, disputes will be resolved on an individual basis, and you waive any right to
          participate in a class or representative action.
        </p>
        <h3>14.4 Exceptions</h3>
        <p>
          Either party may seek injunctive or equitable relief in a court of competent jurisdiction to protect its
          intellectual property or confidential information.
        </p>

        <h2 id="miscellaneous">15. Miscellaneous</h2>
        <h3>15.1 Entire Agreement</h3>
        <p>
          This Agreement, together with the Privacy Policy and any pricing or policies referenced herein, constitutes
          the entire agreement between you and us regarding the Services.
        </p>
        <h3>15.2 Governing Law</h3>
        <p>
          This Agreement is governed by the laws of Singapore, without regard to conflict-of-laws principles, except
          where mandatory local law applies.
        </p>
        <h3>15.3 Language</h3>
        <p>
          This Agreement is drafted in English, which controls in the event of any conflict with a translation.
        </p>
        <h3>15.4 Severability</h3>
        <p>
          If any provision is held invalid or unenforceable, the remaining provisions will remain in full force and
          effect.
        </p>
        <h3>15.5 Headings</h3>
        <p>Headings are for convenience only and do not affect interpretation.</p>
        <h3>15.6 Relationship</h3>
        <p>
          Nothing in this Agreement creates a partnership, agency, or employment relationship between the parties.
        </p>
        <h3>15.7 Waiver</h3>
        <p>Our failure to enforce any provision is not a waiver of our right to do so later.</p>
        <h3>15.8 Electronic Communications</h3>
        <p>
          You consent to receive communications from us electronically, and agree that electronic communications satisfy
          any legal requirement that communications be in writing.
        </p>
        <h3>15.9 Force Majeure</h3>
        <p>
          We are not liable for delays or failures caused by events beyond our reasonable control, including carrier or
          provider outages, natural disasters, or government actions.
        </p>
        <h3>15.10 Notice</h3>
        <p>
          We may provide notices via the dashboard, website, or email. You may contact us at the details in Section 16.
        </p>
        <h3>15.11 Export Control</h3>
        <p>
          You agree to comply with all applicable export-control and sanctions laws and not to use the Services in
          violation of them.
        </p>
        <h3>15.12 Assignment</h3>
        <p>
          You may not assign this Agreement without our consent. We may assign it in connection with a merger,
          acquisition, or sale of assets.
        </p>
        <h3>15.13 Survival</h3>
        <p>Sections that by their nature should survive termination will survive.</p>

        <h2 id="warranties">16. Warranties, Disclaimers, and Contact</h2>
        <h3>16.1 &ldquo;As Is&rdquo;</h3>
        <p>
          The Services are provided &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE,&rdquo; without warranties of any kind,
          whether express, implied, or statutory, including implied warranties of merchantability, fitness for a
          particular purpose, title, and non-infringement, to the fullest extent permitted by law.
        </p>
        <h3>16.2 No Guarantee of Results</h3>
        <p>
          We do not warrant that the Services will be uninterrupted, error-free, secure, or that AI-generated outputs
          will be accurate, complete, or fit for your intended purpose.
        </p>
        <h3>16.3 Contact Us</h3>
        <p>For questions about this Agreement, contact:</p>
        <ul>
          <li>
            <strong>Company Name:</strong> Ace Peak Invest Pte Ltd
          </li>
          <li>
            <strong>Address:</strong> 1 Scotts Road #24-10 Shaw Centre, Singapore 228208, Singapore
          </li>
          <li>
            <strong>Support Email:</strong> <a href="mailto:support@9278.ai">support@9278.ai</a>
          </li>
          <li>
            <strong>Sales &amp; Partnerships:</strong> <a href="mailto:sales@9278.ai">sales@9278.ai</a>
          </li>
          <li>
            <strong>Voice:</strong> <a href="tel:+13474744009">+1 347-474-4009</a>
          </li>
        </ul>
      </article>

      <SiteFooter />
    </main>
  )
}
