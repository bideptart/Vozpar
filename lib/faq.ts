export type FaqItem = {
  q: string
  a: string
  popular?: boolean
}

export type FaqGroup = {
  id: string
  title: string
  items: FaqItem[]
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "billing",
    title: "Billing & credit",
    items: [
      {
        q: "How does pricing work?",
        a: "You top up with $20, $50, or $100 of voice credit. Voice minutes are billed against that credit at $0.15/min on Starter, $0.12/min on Growth, or $0.10/min on Scale. There are no setup fees, no contracts, and no monthly platform fees beyond your top-up.",
        popular: true
      },
      {
        q: "Do my voice minutes expire?",
        a: "Voice credit is valid for 60 days from the date of purchase. After 60 days any unused balance expires. Top up again at any time to extend — every new top-up gets its own fresh 60-day window.",
        popular: true
      },
      {
        q: "Do I need a carrier account?",
        a: "Yes. Vozpar connects to the carrier you already use to handle inbound and outbound voice. We don't sell phone numbers or compete with your provider — your numbers, billing, and porting stay exactly where they are.",
      },
      {
        q: "Can I bring my existing phone numbers?",
        a: "Yes. Connect your existing carrier account in two clicks and your current numbers route through Vozpar instantly. No porting, no downtime, no number changes.",
      },
      {
        q: "Are there any hidden fees?",
        a: "No. The only line item from us is voice credit. There's no setup, no contracts, and no minimums beyond your top-up. Phone numbers stay billed directly by your carrier — we don't add a markup.",
        popular: true
      },
      {
        q: "Do you offer refunds?",
        a: "If you experience a service issue we'll always make it right. Unused credit purchased within the last 14 days is refundable on request.",
      },
      {
        q: "Is the platform self-hosted?",
        a: "Yes. Vozpar ships as a self-hosted control panel — your data, your stack, your infrastructure. Audio, transcripts, and metadata stay inside your environment. There is no shared multi-tenant database holding your call recordings.",
      },
      {
        q: "What languages are supported?",
        a: "English (US, UK, Australian, Indian), Spanish (LATAM and Spain), French, German, Portuguese, and Italian — with native-sounding voices and sub-second latency in all of them. The agent auto-detects the caller's language and switches mid-conversation. More languages on request.",
      },
      {
        q: "Can I top up more than $100?",
        a: "Yes. You can top up multiple times in any combination — Stripe handles every charge. High-volume teams typically run 3–5 Scale top-ups a week.",
      },
    ],
  },
  {
    id: "phone-numbers",
    title: "Phone numbers & connectivity",
    items: [
      {
        q: "Which carrier accounts do you support?",
        a: "Any major SIP-capable carrier. If your provider supports standard SIP trunking and outbound webhook routing, you can connect it to Vozpar in two clicks.",
      },
      {
        q: "Which countries can you route calls in?",
        a: "Out of the box: USA, Canada, UK, Germany, France, Spain, Italy, Netherlands, Ireland, Belgium, and Portugal. We support 60+ other countries on request — your carrier provides the number, we handle the conversation.",
      },
      {
        q: "Can the same number do inbound and outbound?",
        a: "Yes. One number, both directions. Trigger outbound campaigns or answer every incoming call automatically — the same agent, the same dashboard, the same carrier line.",
      },
      {
        q: "Are calls truly carrier-grade?",
        a: "Yes. Calls flow over your provider's Tier-1 network with HD-voice codecs, STIR/SHAKEN attestation in the US, and call-quality monitoring on every leg.",
      },
    ],
  },
  {
    id: "agents",
    title: "Agents & capabilities",
    items: [
      {
        q: "How many concurrent AI agents do I get?",
        a: "1 on the Starter plan, 2 on Growth, and 3 on Scale. That means up to 1, 2, or 3 calls happening simultaneously. Need more? Reach out and we'll tailor a higher-concurrency plan.",
      },
      {
        q: "Can the agent transfer to a human?",
        a: "Yes. Warm transfers, cold transfers, conference, and IVR-style routing are all supported, and you can define the trigger conditions in plain English.",
      },
      {
        q: "Does it integrate with my CRM and calendar?",
        a: "Yes. We integrate with HubSpot, Salesforce, Pipedrive, Google Calendar, Microsoft 365, ServiceTitan, Housecall Pro, OpenTable, Mindbody, and ~200 others via webhooks and Zapier. Custom integrations are part of the Growth and Scale plans.",
      },
      {
        q: "Can I record and transcribe every call?",
        a: "Yes — included on every plan, with PII redaction options. Recordings and transcripts live in your dashboard and can be pushed to your CRM, Slack, or webhook.",
      },
    ],
  },
  {
    id: "compliance",
    title: "Compliance & data",
    items: [
      {
        q: "Where is my data stored?",
        a: "All call audio, transcripts, and metadata are stored in encrypted regional buckets (US East / EU West) and are accessible only to your account.",
      },
      {
        q: "Are you HIPAA-ready?",
        a: "Yes. We sign BAAs with healthcare and dental customers and offer PHI redaction in transcripts. Reach out before you go live with patient calls so we can configure your account properly.",
      },
      {
        q: "What about TCPA, DNC, and consent?",
        a: "We provide DNC scrubbing, consent capture flows, and configurable calling-window enforcement. You're responsible for your campaign's compliance — we provide the guardrails.",
      },
      {
        q: "How do you handle prompt injection and bad actors?",
        a: "Every agent runs inside a sandbox with allow-listed tools, jailbreak detection, and conversation timeouts. Our trust & safety team monitors for abuse 24/7.",
      },
    ],
  },
  {
    id: "account",
    title: "Account & support",
    items: [
      {
        q: "Where do I sign in?",
        a: "Your dashboard lives at voice.Vozpar. You can review usage, top up credit, manage phone numbers, edit agent prompts, and download transcripts.",
      },
      {
        q: "How fast can I be live?",
        a: "Most teams launch their first agent in under 5 minutes from sign-up. Migrating an existing 24/7 inbound flow with full CRM integration typically takes 1–3 days.",
      },
      {
        q: "What support is included?",
        a: "Email support on Starter, priority email + chat on Growth, and a dedicated success manager on Scale. We respond to billing and outage issues 24/7 on every plan.",
      },
    ],
  },
]

export const FLAT_FAQ: FaqItem[] = FAQ_GROUPS.flatMap((g) => g.items)
