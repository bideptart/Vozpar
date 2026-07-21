"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentType, ElementType } from "react"
import {
  AudioLines,
  Hand,
  PhoneCall,
  Languages,
  Wrench,
  Repeat,
  ShieldCheck,
  Activity,
  Webhook,
  Mic,
  CalendarClock,
  Network,
  Check,
  RadioTower,
} from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

/**
 * FeatureShowcase
 * An explorer instead of a wall of cards: a scannable index on the left,
 * one large animated detail panel on the right.
 *
 * Twelve equal cards made the page enormous and gave every capability the
 * same weight, so nothing stood out. Here only one feature is expanded at a
 * time — the section stays a fixed height no matter how many features exist,
 * and each one gets room for a real explanation plus its own visual.
 */

type Category = "Voice" | "Telephony" | "Integrations" | "Operations"

/** Every feature gets its own motif — see the motif components below. */
type MotifKey =
  | "latency"
  | "turntaking"
  | "noise"
  | "languages"
  | "carrier"
  | "transfer"
  | "tools"
  | "calendar"
  | "webhooks"
  | "transcript"
  | "redaction"
  | "concurrency"

type Feature = {
  icon: ElementType
  title: string
  tag: Category
  motif: MotifKey
  blurb: string
  detail: string
  stat: { value: string; label: string }
  points: string[]
}

/**
 * One accent per category, so colour carries meaning instead of just cycling.
 * All four come from the brand reference's chart palette — the set that doc
 * designates for distinguishing series. Crimson is deliberately left out: the
 * brand assigns it to errors/destructive actions, so using it for a feature
 * category would read as a warning.
 */
const CATEGORY_ACCENT: Record<Category, string> = {
  Voice: "var(--features-blue)", // #2F8FE0 bright blue
  Telephony: "var(--features-blue-deep)", // #1E6FD6 swoosh blue
  Integrations: "var(--features-green)", // #1F9D55 growth green
  Operations: "var(--features-amber)", // #F2A71B amber
}

const FEATURES: Feature[] = [
  {
    icon: AudioLines,
    title: "Sub-300ms latency",
    tag: "Voice",
    motif: "latency",
    blurb: "Conversations feel instant, never delayed.",
    detail:
      "Real-time WebRTC audio over a globally distributed media network. Audio goes in and comes back out natively — there's no text bottleneck in the middle adding a beat of silence before every reply.",
    stat: { value: "<300ms", label: "Round-trip response" },
    points: ["Edge media routing", "Native audio in, native audio out", "No text round-trip"],
  },
  {
    icon: Hand,
    title: "Natural turn-taking",
    tag: "Voice",
    motif: "turntaking",
    blurb: "Listens, pauses, and responds like a person.",
    detail:
      "Smart endpointing decides when the caller has actually finished, not just when they paused for breath. Interrupt mid-sentence and the agent stops talking and listens, the way a person would.",
    stat: { value: "Barge-in", label: "Interrupt any time" },
    points: ["Smart endpointing", "Mid-sentence interruption", "Backchannel cues"],
  },
  {
    icon: Mic,
    title: "Background noise removal",
    tag: "Voice",
    motif: "noise",
    blurb: "Busy street, café, or car — still clear.",
    detail:
      "AI-powered noise and echo cancellation runs before speech recognition, so a caller phoning from a moving car is understood as well as one on a headset in a quiet room.",
    stat: { value: "Clean", label: "In any environment" },
    points: ["Echo cancellation", "Ambient noise suppression", "Handset and speakerphone"],
  },
  {
    icon: Languages,
    title: "Multilingual voices",
    tag: "Voice",
    motif: "languages",
    blurb: "Dozens of languages and accents.",
    detail:
      "Auto-detect the caller's language on the first utterance and switch mid-call when they do. Pick a voice per agent, per region, or per campaign.",
    stat: { value: "30+", label: "Languages supported" },
    points: ["Auto language detection", "Mid-call switching", "Per-agent voice selection"],
  },
  {
    icon: PhoneCall,
    title: "Carrier-grade telephony",
    tag: "Telephony",
    motif: "carrier",
    blurb: "Inbound and outbound PSTN over SIP.",
    detail:
      "Connect the carrier you already pay for and route calls intelligently. Your numbers, your billing, unchanged — no porting, no lock-in, no second telecom relationship to manage.",
    stat: { value: "60+", label: "Countries covered" },
    points: ["Bring your own SIP trunk", "Local and toll-free numbers", "Intelligent call routing"],
  },
  {
    icon: Repeat,
    title: "Live transfer & handoff",
    tag: "Telephony",
    motif: "transfer",
    blurb: "Warm-transfer without repeating the customer.",
    detail:
      "Hand off to a human or swap between specialist agents mid-call, passing the full conversation context along. The person picking up already knows who's on the line and why.",
    stat: { value: "0", label: "Context lost on transfer" },
    points: ["Warm transfer to humans", "Agent-to-agent swaps", "Full context handoff"],
  },
  {
    icon: Wrench,
    title: "Tools & function calling",
    tag: "Integrations",
    motif: "tools",
    blurb: "Your agent uses the same APIs your team does.",
    detail:
      "Look up a CRM record, check inventory, take a payment, or hit any internal endpoint — mid-sentence, while the caller waits a beat rather than a hold queue.",
    stat: { value: "Any API", label: "Callable mid-conversation" },
    points: ["CRM lookups and writebacks", "Payments and inventory", "Custom HTTP endpoints"],
  },
  {
    icon: CalendarClock,
    title: "Scheduling & calendars",
    tag: "Integrations",
    motif: "calendar",
    blurb: "Book, reschedule, and confirm over voice.",
    detail:
      "Native Google, Outlook, and Calendly integrations with real availability checks — so the slot the agent offers is a slot that's genuinely open.",
    stat: { value: "Live", label: "Availability checks" },
    points: ["Google and Outlook", "Calendly support", "Reschedule and cancel flows"],
  },
  {
    icon: Webhook,
    title: "Webhooks & APIs",
    tag: "Integrations",
    motif: "webhooks",
    blurb: "Pipe call data into your stack in real time.",
    detail:
      "Fire events on call start, transcript chunks, tool calls, or completion. Stream them into your warehouse, trigger downstream automations, or drive a live dashboard.",
    stat: { value: "Realtime", label: "Event streaming" },
    points: ["Lifecycle event hooks", "Streaming transcript chunks", "Retries and signing"],
  },
  {
    icon: Activity,
    title: "Live transcripts & analytics",
    tag: "Operations",
    motif: "transcript",
    blurb: "Searchable from day one.",
    detail:
      "Every call streamed to text with speaker labels, sentiment, detected intents, and conversion events — so you can answer why calls did or didn't convert without listening to recordings.",
    stat: { value: "100%", label: "Calls transcribed" },
    points: ["Speaker-labelled transcripts", "Sentiment and intent", "Conversion events"],
  },
  {
    icon: ShieldCheck,
    title: "Recording, redaction & compliance",
    tag: "Operations",
    motif: "redaction",
    blurb: "Configurable PII handling out of the box.",
    detail:
      // "SOC 2-aligned" was a hedge with nothing behind it: /dpa mentions SOC 2
      // only as one option for satisfying an audit request, not as a report
      // that exists. A security reviewer reads "aligned" as "not certified"
      // and trusts the rest of the page less for it. These are the controls
      // the DPA actually commits to.
      "Redact card numbers and personal data before storage, set retention windows per region, and keep everything encrypted at rest. Art. 32 security measures are contractual, and data is deleted or returned within 30 days of termination.",
    stat: { value: "30 days", label: "Deletion on termination" },
    points: ["Automatic PII redaction", "Per-region retention", "Encrypted at rest"],
  },
  {
    icon: Network,
    title: "Massive concurrency",
    tag: "Operations",
    motif: "concurrency",
    blurb: "One call or thousands, no provisioning.",
    detail:
      "Burst capacity is built in. A campaign that goes from twenty calls an hour to two thousand doesn't need a capacity ticket, a new licence tier, or a bigger fleet.",
    stat: { value: "Unlimited", label: "Parallel calls" },
    points: ["Automatic burst scaling", "No per-port licensing", "No fleet sizing"],
  },
]

/* ---------------------------------------------------------------------- */
/* Motifs — one bespoke animation per feature, rendered in the detail panel.
   Every value here is a static literal (never Math.random / Date), because
   these end up in inline styles that must match between the server render
   and hydration.                                                          */
/* ---------------------------------------------------------------------- */

type MotifProps = { accent: string; reduced: boolean | null }

const shell = "relative flex h-24 items-center justify-center"
const loop = Number.POSITIVE_INFINITY

/** 1. Latency — a pulse racing across a timing track against tick marks. */
function LatencyMotif({ accent, reduced }: MotifProps) {
  return (
    <div className={shell}>
      <div className="relative w-full max-w-xs">
        <div className="flex justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="h-3 w-px" style={{ background: `color-mix(in srgb, ${accent} 30%, transparent)` }} />
          ))}
        </div>
        <div className="relative mt-2 h-1 rounded-full" style={{ background: `color-mix(in srgb, ${accent} 18%, transparent)` }}>
          <motion.span
            className="absolute -top-1 h-3 w-3 rounded-full"
            style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
            animate={reduced ? { left: "70%" } : { left: ["0%", "70%"] }}
            transition={{ duration: 0.75, repeat: loop, repeatDelay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="mt-3 flex justify-between font-mono text-[10px] text-muted-foreground/60">
          <span>0ms</span>
          <span style={{ color: accent }}>300ms</span>
          <span>1s</span>
        </div>
      </div>
    </div>
  )
}

/** 2. Turn-taking — caller and agent waveforms trading the floor. */
function TurnTakingMotif({ accent, reduced }: MotifProps) {
  const rows = [
    { label: "Caller", delay: 0 },
    { label: "Agent", delay: 1.6 },
  ]
  const bars = [0.4, 0.8, 0.55, 1, 0.6, 0.85, 0.45]
  return (
    <div className="flex h-24 flex-col justify-center gap-3">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3">
          <span className="w-12 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">{row.label}</span>
          <motion.div
            className="flex h-6 items-center gap-1"
            animate={reduced ? { opacity: 0.6 } : { opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 3.2, times: [0, 0.3, 0.6], repeat: loop, delay: row.delay, ease: "easeInOut" }}
          >
            {bars.map((h, i) => (
              <motion.span
                key={i}
                className="w-1.5 rounded-full"
                style={{ height: "100%", transformOrigin: "center", background: accent }}
                animate={reduced ? { scaleY: h } : { scaleY: [0.2, h, 0.2] }}
                transition={{ duration: 0.7, repeat: loop, delay: row.delay + i * 0.06, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  )
}

/** 3. Noise removal — jagged input on the left, clean output on the right. */
function NoiseMotif({ accent, reduced }: MotifProps) {
  const noisy = [0.9, 0.3, 1, 0.45, 0.75, 0.2, 0.95, 0.35]
  const clean = [0.5, 0.65, 0.6, 0.7, 0.62, 0.68, 0.55, 0.64]
  return (
    <div className="flex h-24 items-center justify-center gap-4">
      <div className="flex h-14 items-center gap-1">
        {noisy.map((h, i) => (
          <motion.span
            key={i}
            className="w-1.5 rounded-full bg-slate-600"
            style={{ height: "100%", transformOrigin: "center" }}
            animate={reduced ? { scaleY: h } : { scaleY: [h, 0.25, h * 0.8, 0.4, h] }}
            transition={{ duration: 0.8, repeat: loop, delay: i * 0.04, ease: "linear" }}
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: accent }}>
          filter
        </span>
        <span className="h-10 w-px" style={{ background: `color-mix(in srgb, ${accent} 50%, transparent)` }} />
      </div>
      <div className="flex h-14 items-center gap-1">
        {clean.map((h, i) => (
          <motion.span
            key={i}
            className="w-1.5 rounded-full"
            style={{ height: "100%", transformOrigin: "center", background: accent }}
            animate={reduced ? { scaleY: h } : { scaleY: [h * 0.85, h, h * 0.85] }}
            transition={{ duration: 1.8, repeat: loop, delay: i * 0.08, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  )
}

/** 4. Multilingual — greetings cycling through languages. */
const GREETINGS = [
  { text: "Hello", code: "en-US" },
  { text: "Hola", code: "es-ES" },
  { text: "Bonjour", code: "fr-FR" },
  { text: "नमस्ते", code: "hi-IN" },
  { text: "こんにちは", code: "ja-JP" },
  { text: "Hallo", code: "de-DE" },
]

function LanguagesMotif({ accent, reduced }: MotifProps) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setI((n) => (n + 1) % GREETINGS.length), 1600)
    return () => clearInterval(id)
  }, [reduced])
  const g = GREETINGS[i]
  return (
    <div className={shell}>
      <AnimatePresence mode="wait">
        <motion.div
          key={g.code}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="font-heading text-2xl font-medium tracking-[-0.02em] text-foreground sm:text-3xl">
            {g.text}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: accent }}>
            {g.code}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/**
 * 5. Carrier — DIDs on the left, your trunk on the right, the tower routing
 * between them.
 *
 * The earlier version was a lone pulsing dot centred in a very wide box, which
 * read as empty rather than minimal and said nothing about what the feature
 * does. This one puts the actual claim on screen: numbers in many countries,
 * on the carrier you already have.
 *
 * The country-code column and the trunk label drop out below sm — at 320px the
 * five-part row would collapse into slivers, and the tower alone still reads.
 */
function CarrierMotif({ accent, reduced }: MotifProps) {
  const codes = ["+1", "+44", "+91"]
  const mix = (pct: number) => `color-mix(in srgb, ${accent} ${pct}%, transparent)`

  return (
    <div className={shell}>
      <div className="flex w-full max-w-sm items-center justify-center gap-2 px-2 sm:gap-3">
        {/* Local numbers */}
        <div className="hidden shrink-0 flex-col gap-1 sm:flex">
          {codes.map((c, i) => (
            <motion.span
              key={c}
              className="rounded-md border px-1.5 py-0.5 text-center font-mono text-[9px] leading-none"
              style={{ borderColor: mix(30), color: accent }}
              animate={reduced ? undefined : { opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.4, repeat: loop, ease: "easeInOut", delay: i * 0.5 }}
            >
              {c}
            </motion.span>
          ))}
        </div>

        <Hop accent={accent} reduced={reduced} delays={[0, 0.9]} />

        {/* Tower + expanding arcs */}
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute rounded-full border"
              style={{ height: 28, width: 28, borderColor: mix(50) }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={reduced ? undefined : { scale: [0.5, 2.4], opacity: [0.8, 0] }}
              transition={{ duration: 2.8, repeat: loop, ease: "easeOut", delay: i * 0.9 }}
            />
          ))}
          <span
            className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: mix(22) }}
          >
            <RadioTower className="h-4 w-4" style={{ color: accent }} aria-hidden />
          </span>
        </div>

        <Hop accent={accent} reduced={reduced} delays={[0.45, 1.35]} />

        {/* Your existing trunk */}
        <div className="hidden shrink-0 flex-col items-center gap-1 sm:flex">
          <span
            className="rounded-md border px-1.5 py-0.5 font-mono text-[9px] leading-none"
            style={{ borderColor: mix(30), color: accent }}
          >
            SIP
          </span>
          <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50">
            your trunk
          </span>
        </div>
      </div>
    </div>
  )
}

/** A hairline with packets running along it. Shared by the carrier motif. */
function Hop({ accent, reduced, delays }: MotifProps & { delays: number[] }) {
  return (
    <div className="relative h-px min-w-6 flex-1" style={{ background: `color-mix(in srgb, ${accent} 25%, transparent)` }}>
      {delays.map((d) => (
        <motion.span
          key={d}
          className="absolute -top-[2px] block h-[5px] w-[5px] rounded-full"
          style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
          initial={{ left: "0%", opacity: 0 }}
          animate={reduced ? undefined : { left: ["0%", "calc(100% - 5px)"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.7, repeat: loop, repeatDelay: 0.7, delay: d, ease: "linear" }}
        />
      ))}
    </div>
  )
}

/** 6. Transfer — context handed from one party to the next. */
function TransferMotif({ accent, reduced }: MotifProps) {
  return (
    <div className={shell}>
      <div className="flex w-full max-w-xs items-center justify-between">
        <div className="flex flex-col items-center gap-1.5">
          <span className="h-9 w-9 rounded-full" style={{ background: `color-mix(in srgb, ${accent} 30%, transparent)` }} />
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">Agent</span>
        </div>
        <div className="relative mx-3 h-px flex-1" style={{ background: `color-mix(in srgb, ${accent} 30%, transparent)` }}>
          <motion.span
            className="absolute -top-[7px] rounded-full px-1.5 py-0.5 font-mono text-[8px] font-medium text-white"
            style={{ background: accent }}
            animate={reduced ? { left: "40%" } : { left: ["0%", "72%"] }}
            transition={{ duration: 1.8, repeat: loop, repeatDelay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            ctx
          </motion.span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <motion.span
            className="h-9 w-9 rounded-full"
            style={{ background: `color-mix(in srgb, ${accent} 30%, transparent)` }}
            animate={reduced ? undefined : { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.3, repeat: loop, ease: "easeInOut", delay: 1.4 }}
          />
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">Human</span>
        </div>
      </div>
    </div>
  )
}

/** 7. Tools — a hub firing requests out to four services and back. */
function ToolsMotif({ accent, reduced }: MotifProps) {
  const satellites = [
    { left: "12%", top: "18%" },
    { left: "88%", top: "18%" },
    { left: "12%", top: "82%" },
    { left: "88%", top: "82%" },
  ]
  return (
    <div className={shell}>
      <motion.span
        className="absolute z-10 h-11 w-11 rounded-xl border"
        style={{
          background: `color-mix(in srgb, ${accent} 22%, transparent)`,
          borderColor: `color-mix(in srgb, ${accent} 50%, transparent)`,
        }}
        animate={reduced ? undefined : { scale: [1, 1.1, 1] }}
        transition={{ duration: 2.4, repeat: loop, ease: "easeInOut" }}
      />
      {satellites.map((s, i) => (
        <motion.span
          key={i}
          className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-md border"
          style={{
            left: s.left,
            top: s.top,
            borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`,
            background: `color-mix(in srgb, ${accent} 12%, transparent)`,
          }}
          animate={reduced ? undefined : { opacity: [0.25, 1, 0.25], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.8, repeat: loop, ease: "easeInOut", delay: i * 0.45 }}
        />
      ))}
    </div>
  )
}

/** 8. Calendar — an open slot getting booked. */
function CalendarMotif({ accent, reduced }: MotifProps) {
  const booked = 7
  return (
    <div className={shell}>
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: 15 }, (_, i) => {
          const isBooked = i === booked
          return (
            <motion.span
              key={i}
              className="h-4 w-7 rounded-[3px] sm:w-9"
              style={{ background: isBooked ? accent : "rgba(255,255,255,0.07)" }}
              animate={
                reduced || !isBooked
                  ? undefined
                  : { opacity: [0.35, 1, 1, 0.35], scale: [0.94, 1.06, 1.06, 0.94] }
              }
              transition={{ duration: 2.6, times: [0, 0.25, 0.75, 1], repeat: loop, ease: "easeInOut" }}
            />
          )
        })}
      </div>
    </div>
  )
}

/** 9. Webhooks — event packets streaming down a lane. */
function WebhooksMotif({ accent, reduced }: MotifProps) {
  return (
    <div className={shell}>
      <div className="relative h-8 w-full max-w-xs overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="absolute top-1/2 h-3 w-8 -translate-y-1/2 rounded-full"
            style={{ background: `color-mix(in srgb, ${accent} 75%, transparent)` }}
            initial={{ left: "-20%" }}
            animate={reduced ? { left: `${18 + i * 20}%` } : { left: ["-20%", "110%"] }}
            transition={{ duration: 2.2, repeat: loop, ease: "linear", delay: i * 0.55 }}
          />
        ))}
      </div>
    </div>
  )
}

/** 10. Transcript — lines of speech landing as they're spoken. */
function TranscriptMotif({ accent, reduced }: MotifProps) {
  const lines = [
    { w: "72%", mine: false },
    { w: "54%", mine: true },
    { w: "84%", mine: false },
  ]
  return (
    <div className="flex h-24 flex-col justify-center gap-2.5">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: l.mine ? accent : "rgba(255,255,255,0.25)" }}
          />
          <motion.span
            className="h-2.5 rounded-full"
            style={{ background: l.mine ? `color-mix(in srgb, ${accent} 45%, transparent)` : "rgba(255,255,255,0.12)" }}
            initial={{ width: 0 }}
            animate={{ width: l.w }}
            transition={{ duration: 0.7, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
          />
          {i === lines.length - 1 && !reduced && (
            <motion.span
              className="h-3 w-[2px]"
              style={{ background: accent }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: loop, ease: "linear" }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}

/** 11. Redaction — sensitive digits masking themselves out. */
function RedactionMotif({ accent, reduced }: MotifProps) {
  return (
    <div className={shell}>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 12 }, (_, i) => {
          const isSensitive = i >= 3 && i <= 8
          return (
            <motion.span
              key={i}
              className="rounded-[2px]"
              style={{
                height: 18,
                width: 10,
                background: isSensitive ? accent : "rgba(255,255,255,0.18)",
              }}
              animate={
                reduced || !isSensitive
                  ? undefined
                  : { opacity: [1, 1, 0.25, 0.25], scaleY: [1, 1, 0.35, 0.35] }
              }
              transition={{
                duration: 3,
                times: [0, 0.35, 0.55, 1],
                repeat: loop,
                ease: "easeInOut",
                delay: (i - 3) * 0.08,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

/** 12. Concurrency — a grid of calls lighting up all at once. */
function ConcurrencyMotif({ accent, reduced }: MotifProps) {
  return (
    <div className={shell}>
      <div className="grid grid-cols-10 gap-1.5">
        {Array.from({ length: 30 }, (_, i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full"
            style={{ background: accent }}
            initial={{ opacity: 0.12, scale: 0.7 }}
            animate={reduced ? { opacity: 0.7, scale: 1 } : { opacity: [0.12, 1, 0.12], scale: [0.7, 1, 0.7] }}
            transition={{
              duration: 2.4,
              repeat: loop,
              ease: "easeInOut",
              // row + column offset gives a diagonal sweep across the grid
              delay: ((i % 10) + Math.floor(i / 10)) * 0.09,
            }}
          />
        ))}
      </div>
    </div>
  )
}

const MOTIFS: Record<MotifKey, ComponentType<MotifProps>> = {
  latency: LatencyMotif,
  turntaking: TurnTakingMotif,
  noise: NoiseMotif,
  languages: LanguagesMotif,
  carrier: CarrierMotif,
  transfer: TransferMotif,
  tools: ToolsMotif,
  calendar: CalendarMotif,
  webhooks: WebhooksMotif,
  transcript: TranscriptMotif,
  redaction: RedactionMotif,
  concurrency: ConcurrencyMotif,
}

export function FeatureShowcase() {
  const reduced = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)

  /**
   * Roving arrow-key navigation.
   *
   * The tablist runs horizontally on phones and vertically from lg, so all
   * four arrows are handled rather than picking an orientation — the same
   * reason `aria-orientation` was dropped: it can't be statically correct for
   * both. Focus moves with the selection, which is what makes the automatic
   * activation pattern usable: without it, arrowing changed the panel while
   * focus sat on whichever tab was tabbed to.
   */
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const focusTab = (i: number) => {
    const next = (i + FEATURES.length) % FEATURES.length
    setActiveIndex(next)
    tabRefs.current[next]?.focus()
  }
  const onTabKeyDown = (e: React.KeyboardEvent, i: number) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault()
        focusTab(i + 1)
        break
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault()
        focusTab(i - 1)
        break
      case "Home":
        e.preventDefault()
        focusTab(0)
        break
      case "End":
        e.preventDefault()
        focusTab(FEATURES.length - 1)
        break
    }
  }

  const active = FEATURES[activeIndex]
  const accent = CATEGORY_ACCENT[active.tag]
  const ActiveIcon = active.icon
  const ActiveMotif = MOTIFS[active.motif]

  return (
    <section
      id="features"
      className="features-hero-dark relative overflow-hidden border-t border-border"
      style={{ background: "var(--features-hero-bg)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-60 blur-[140px]"
        style={{ background: "color-mix(in srgb, var(--features-blue-deep) 26%, transparent)" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        {/* Centred to match every other section header on the page — this was
            the only one still left-aligned. */}
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="ai-pill-blue">
            <span className="h-1 w-1 rounded-full bg-current" />
            The toolkit
          </span>
          {/* H2 — Archivo 500, −1.4px tracking */}
          <h2 className="mt-5 text-balance font-heading text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
            Twelve building blocks, one platform.
          </h2>
          <p className="mt-4 text-pretty text-[15px] font-light leading-relaxed text-muted-foreground">
            Move through the list and each one opens as you reach it. Together they cover the whole call, from the
            first ring to the row that lands in your CRM.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:mt-14 lg:grid-cols-12 lg:gap-6">
          {/* INDEX — horizontal snap rail on phones, vertical list from lg.
              Three things here are load-bearing:
              · `layoutScroll` — the active background is a `layoutId` element,
                and inside a scrollable ancestor motion measures against the
                viewport unless told to account for scroll offset, so the
                highlight jumped to the wrong chip once the rail was scrolled.
              · `scroll-pl-*` — the snapport is the scrollport minus scroll
                padding, which defaults to 0. Without it the only valid snap
                position for chip 1 is scrollLeft:16 (it sits behind `px-4`), so
                mandatory snapping shunts it flush to the screen edge and out of
                line with the heading above.
              · scrollbar hidden — `overflow-x-auto` holds until lg, so between
                768 and 1023px Windows and Linux draw a bar under the rail. */}
          <motion.div
            layoutScroll
            role="tablist"
            aria-label="Platform features"
            className="-mx-4 flex snap-x snap-mandatory scroll-pl-4 gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-pl-6 sm:px-6 lg:col-span-5 lg:mx-0 lg:snap-none lg:scroll-pl-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {FEATURES.map((f, i) => {
              const isActive = i === activeIndex
              const Icon = f.icon
              const itemAccent = CATEGORY_ACCENT[f.tag]
              return (
                <button
                  key={f.title}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  role="tab"
                  aria-selected={isActive}
                  // Roving tabindex: one stop for the whole list, then arrows.
                  // Twelve individually tabbable tabs meant a keyboard user had
                  // to press Tab twelve times to get past this section.
                  tabIndex={isActive ? 0 : -1}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  onClick={() => setActiveIndex(i)}
                  // Hover opens the panel — no click needed. Guarded to mouse:
                  // on a touch device `pointerenter` fires on tap alongside
                  // click, and a finger dragged down the list while scrolling
                  // would otherwise flip panels the whole way.
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") setActiveIndex(i)
                  }}
                  // Keyboard gets the same behaviour: focus selects, so arrowing
                  // through the list reveals each panel in turn. Paired with the
                  // roving tabindex and the arrow handler above, this is the
                  // full ARIA "automatic activation" tabs pattern.
                  onFocus={() => setActiveIndex(i)}
                  // Desktop rows are ~48px: py-1.5 (12) around two lines whose
                  // line-heights stay at 20px and 16px (the arbitrary
                  // `text-[13px]`/`text-[11px]` override font-size only). Twelve
                  // of those plus gap-0.5 puts the index at ~598px, down from
                  // ~770px before the padding and type sizes were tightened.
                  //
                  // Phone chips cap at 13rem. Uncapped, the longest title ran
                  // ~305px against ~304px of visible track — exactly one chip
                  // on screen at 320px. The cap buys a chip and a half, not
                  // two; two full chips would need a ~9rem cap, which leaves
                  // 70px of title and clips almost every one of them.
                  className="group relative flex max-w-[13rem] shrink-0 snap-start items-center gap-3 rounded-xl border border-border bg-card/30 px-3 py-2.5 text-left transition-[translate,background-color] duration-300 hover:bg-card/40 lg:max-w-none lg:w-full lg:shrink lg:snap-align-none lg:gap-2.5 lg:border-0 lg:bg-transparent lg:py-1.5 lg:hover:translate-x-1"
                >
                  {/* Sliding active background — one element that animates
                      between rows rather than 12 cross-fading backgrounds. */}
                  {isActive && (
                    <motion.span
                      layoutId="showcase-active"
                      // -inset-px, not inset-0: `inset-0` resolves to the
                      // padding box, i.e. inside the chip's own 1px border on
                      // mobile, stacking two borders with mismatched corner
                      // radii. This sits on top of it instead.
                      className="absolute -inset-px rounded-xl border border-border bg-card lg:inset-0"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}

                  {/* Edge marker. Half-height on hover, full when selected, so
                      the row still acknowledges the cursor in the instant
                      before the active background slides across. */}
                  <span
                    aria-hidden
                    className={`absolute -left-1 top-1/2 hidden h-5 w-[2px] -translate-y-1/2 rounded-full transition-[scale,opacity] duration-300 lg:block ${
                      isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 group-hover:scale-y-50 group-hover:opacity-60"
                    }`}
                    style={{ background: itemAccent }}
                  />

                  <span
                    // Back to 32px on desktop now the row carries two lines:
                    // the text block is ~34px tall, so it drives the row height
                    // and a 28px tile just looked undersized next to it. Costs
                    // nothing in height.
                    className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-[background-color,border-color,color,scale] duration-300 group-hover:scale-105 lg:h-8 lg:w-8"
                    style={{
                      background: isActive
                        ? `color-mix(in srgb, ${itemAccent} 20%, transparent)`
                        : "var(--card)",
                      borderColor: isActive
                        ? `color-mix(in srgb, ${itemAccent} 45%, transparent)`
                        : "var(--border)",
                      color: isActive ? itemAccent : "var(--muted-foreground)",
                    }}
                  >
                    <Icon className="h-[17px] w-[17px] lg:h-4 lg:w-4" aria-hidden="true" />
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span
                      // Two lines on the rail, one in the list. With the blurb
                      // hidden on phones the title is the only label a chip
                      // has, and at the 13rem cap seven of the twelve would
                      // otherwise clip mid-word ("Recording, redactio…").
                      // Both states are line-clamp so there's no display/
                      // white-space conflict to resolve between breakpoints.
                      className={`text-sm font-medium transition-colors line-clamp-2 lg:line-clamp-1 lg:text-[13px] ${
                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {f.title}
                    </span>
                    {/* Desktop list only. On the phone rail a second line would
                        widen every chip and cut how many fit on screen, which is
                        already the rail's weak point. In the vertical list it
                        costs nothing horizontally.

                        Shown on every row, never only the selected one:
                        revealing it just for the active row would change that
                        row's height and shove everything below it down by ~16px
                        mid-hover, handing the cursor a different item than the
                        one it was pointing at. */}
                    <span className="hidden truncate text-xs font-light text-muted-foreground/60 lg:block lg:text-[11px]">
                      {f.blurb}
                    </span>
                  </span>
                </button>
              )
            })}
          </motion.div>

          {/* DETAIL PANEL */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 shadow-xl shadow-black/30 backdrop-blur-md">
              {/* Panel chrome */}
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                  capability · {String(activeIndex + 1).padStart(2, "0")}/12
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                  style={{
                    color: accent,
                    background: `color-mix(in srgb, ${accent} 14%, transparent)`,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                  {active.tag}
                </span>
              </div>

              {/* `mode="wait"` stays — the panel is in normal flow, so letting
                  two versions overlap would jump the section's height. But the
                  exit is deliberately much faster than the entrance now that
                  hovering swaps panels: at a symmetric 0.28s each, sweeping the
                  cursor down twelve rows queues 0.56s per swap and the panel
                  visibly trails the pointer. Fast out, unhurried in. */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6, transition: { duration: 0.1, ease: "easeIn" } }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="p-5 sm:p-7"
                  role="tabpanel"
                >
                  {/* Motif */}
                  <div
                    className="rounded-xl border border-border px-4 py-5"
                    style={{
                      background: `linear-gradient(160deg, color-mix(in srgb, ${accent} 10%, transparent), transparent)`,
                    }}
                  >
                    <ActiveMotif accent={accent} reduced={reduced} />
                  </div>

                  {/* Stacks on phones. Sitting the copy beside a 44px icon in
                      a 246px panel leaves it ~186px — about twenty-five
                      characters a line, so the detail paragraph ran ten
                      lines. */}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
                      style={{
                        background: `color-mix(in srgb, ${accent} 18%, transparent)`,
                        borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`,
                        color: accent,
                      }}
                    >
                      <ActiveIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      {/* H4 / card title — Archivo 500, −0.48px tracking */}
                      <h3 className="font-heading text-lg font-medium leading-[1.2] tracking-[-0.02em] text-foreground sm:text-xl">
                        {active.title}
                      </h3>
                      <p className="mt-2 text-[15px] font-light leading-relaxed text-muted-foreground">
                        {active.detail}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-5">
                    {/* Headline stat */}
                    <div className="sm:col-span-2">
                      <p className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground sm:text-3xl">
                        {active.stat.value}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
                        {active.stat.label}
                      </p>
                    </div>
                    {/* Supporting points — Inter 400, 14px */}
                    <ul className="space-y-2 sm:col-span-3">
                      {active.points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-sm leading-[1.4] text-muted-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
