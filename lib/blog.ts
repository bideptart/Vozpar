/**
 * Lightweight, file-based blog content for 9278.ai.
 * Add a new entry here to publish a post — the index and [slug] pages render
 * from this single source.
 */

export type BlogSection = { heading?: string; body: string[] }

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string // ISO yyyy-mm-dd
  readingMinutes: number
  author: string
  featured?: boolean
  content: BlogSection[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-ai-voice-agents-finally-sound-human",
    title: "Why AI voice agents finally sound human",
    excerpt:
      "Early voicebots were slow, robotic, and obviously machines. Here's what changed — and why a caller now feels heard instead of processed.",
    category: "Product",
    date: "2026-06-24",
    readingMinutes: 5,
    author: "The 9278.ai Team",
    featured: true,
    content: [
      {
        body: [
          "For years, automated phone systems meant one thing to callers: frustration. Press 1, press 2, repeat yourself, wait on hold. Even the first generation of AI voicebots didn't help much — they were slow to respond, talked over people, and never quite understood what you meant.",
          "That has changed. Modern AI voice agents hold a real conversation. The difference comes down to three things working together: latency, native audio, and real interruptions.",
        ],
      },
      {
        heading: "Latency is the whole game",
        body: [
          "A human conversation has a rhythm. Pauses longer than about a second feel awkward; longer than two and the other person assumes the line dropped. Legacy systems chained speech-to-text, a language model, and text-to-speech in sequence, stacking up delay at every hop.",
          "9278.ai targets sub-300ms response times. Under that threshold, the back-and-forth feels natural — the agent answers like someone who was actually listening, not a machine catching up.",
        ],
      },
      {
        heading: "Native audio, not text in disguise",
        body: [
          "When an agent works directly with audio instead of round-tripping everything through text, it keeps the nuance: tone, pacing, and the ability to handle a caller who changes their mind mid-sentence. It also means the agent can be interrupted — and gracefully pick the conversation back up.",
        ],
      },
      {
        heading: "The result",
        body: [
          "An AI receptionist, sales rep, or support agent that answers every call, sounds human, and is live in an afternoon. Callers get help instead of a menu — and your team stops losing the calls they can't get to.",
        ],
      },
    ],
  },
  {
    slug: "bring-your-own-carrier",
    title: "Bring your own carrier: connect the numbers you already have",
    excerpt:
      "9278.ai doesn't sell phone numbers — it connects to the carrier account you already use. Here's why that matters for control, billing, and porting.",
    category: "Platform",
    date: "2026-06-23",
    readingMinutes: 4,
    author: "The 9278.ai Team",
    content: [
      {
        body: [
          "A lot of voice platforms lock you in by selling you new numbers on their network. Switch away, and you're stuck porting numbers and renegotiating rates. We took a different approach.",
        ],
      },
      {
        heading: "Your numbers stay yours",
        body: [
          "9278.ai is a software and connectivity layer. You connect the carrier account you already have, and your phone numbers, SIP trunks, billing, and porting rights stay exactly where they are. We handle the AI brain; your carrier carries the call.",
        ],
      },
      {
        heading: "Inbound and outbound, one setup",
        body: [
          "Route inbound calls to an AI agent that answers instantly, or trigger outbound campaigns — same dashboard, same agent. Because it rides your existing carrier, you keep the relationship and the rates you negotiated.",
        ],
      },
    ],
  },
  {
    slug: "cutting-call-latency-below-300ms",
    title: "Cutting call latency below 300ms",
    excerpt:
      "Sub-second is the difference between a conversation and a frustrating wait. A look at where the milliseconds go — and how we claw them back.",
    category: "Engineering",
    date: "2026-06-20",
    readingMinutes: 6,
    author: "The 9278.ai Team",
    content: [
      {
        body: [
          "\"Sub-second latency\" gets thrown around a lot. What actually matters is the time between a caller finishing their sentence and the agent starting its reply. Cross ~300ms and it stops feeling human.",
        ],
      },
      {
        heading: "Where the time goes",
        body: [
          "Network transit, speech recognition, the model's thinking time, and speech synthesis all add up. The naive approach runs them one after another. The trick is to overlap them — start understanding before the caller has finished, and start speaking before the full reply is generated.",
        ],
      },
      {
        heading: "Streaming everything",
        body: [
          "By streaming audio in and audio out, the agent can begin responding the instant it has enough to go on. Combined with edge routing through carrier-grade infrastructure, that's how we keep the median response under 300ms in real calls — not just in a demo.",
        ],
      },
    ],
  },
  {
    slug: "ai-voice-compliance-done-right",
    title: "AI-voice compliance, done right",
    excerpt:
      "Disclosure, recording consent, and telemarketing rules vary by region. A practical primer on staying compliant across the US, EU/UK, and LATAM.",
    category: "Compliance",
    date: "2026-06-17",
    readingMinutes: 5,
    author: "The 9278.ai Team",
    content: [
      {
        body: [
          "Running AI voice agents at scale means taking compliance seriously from day one — not bolting it on later. The rules differ by jurisdiction, but a few principles travel everywhere.",
        ],
      },
      {
        heading: "Disclose that it's AI",
        body: [
          "Where required (and increasingly everywhere), your agent should tell callers up front that they're speaking with an automated assistant, and identify the business. The EU AI Act and the US FCC's AI-voice ruling both point in this direction.",
        ],
      },
      {
        heading: "Get consent for recording",
        body: [
          "Recording laws range from one-party to all-party consent depending on the state or country. The safe default is to announce recording at the start and proceed only if the caller agrees.",
        ],
      },
      {
        heading: "How 9278.ai helps",
        body: [
          "We build in configurable disclosure, recording controls, and data-protection guardrails across the US, EU/UK, and Latin America — so the compliant path is the default path. See our compliance center for the full set of policies.",
        ],
      },
    ],
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  return `${d} ${months[m - 1]} ${y}`
}
