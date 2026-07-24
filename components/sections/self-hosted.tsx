"use client"

import { Server, Lock, ShieldCheck, Key, Database } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

// ─── Infrastructure illustration — Image 3 placeholder ───────────────────────
// Replace with <Image> when final artwork is ready.

function InfraIllustration({ reduced }: { reduced: boolean }) {
  const layers = [
    { label: "Your cloud / on-prem", icon: Server,      tint: "#2d98f1", y: "15%" },
    { label: "Vozpar voice engine",  icon: Lock,        tint: "#046bd2", y: "42%" },
    { label: "Private data layer",   icon: Database,    tint: "#2d98f1", y: "69%" },
  ]

  return (
    <div
      role="img"
      aria-label="Infrastructure diagram: private cloud at the top, Vozpar engine in the centre, private data layer at the bottom, all enclosed in a secure boundary"
      className="relative flex w-full select-none items-center justify-center overflow-hidden rounded-2xl border border-white/[0.07] bg-[#030509]"
      style={{ aspectRatio: "1 / 1" }}
    >
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(4,107,210,0.10) 0%, transparent 70%)" }}
      />

      {/* Perimeter border — "secure boundary" */}
      <motion.div
        aria-hidden
        className="absolute inset-6 rounded-2xl border border-dashed border-[#046bd2]/25"
        animate={reduced ? undefined : { opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-8 -translate-x-1/2 rounded-full border border-[#046bd2]/30 bg-[#046bd2]/10 px-3 py-0.5 font-mono text-[7px] uppercase tracking-[0.18em] text-[#2d98f1]/60"
      >
        Private boundary
      </span>

      {/* Layers */}
      <div className="relative z-10 flex h-[70%] w-[60%] flex-col justify-between">
        {layers.map((l, i) => {
          const Icon = l.icon
          return (
            <motion.div
              key={l.label}
              className="flex items-center gap-3 rounded-xl border px-4 py-3"
              style={{
                borderColor: `${l.tint}28`,
                background: `linear-gradient(90deg, ${l.tint}0e, rgba(0,0,0,0.4))`,
              }}
              initial={reduced ? undefined : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: `${l.tint}18`, color: l.tint }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-medium text-white/70">{l.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Connector lines between layers */}
      <svg aria-hidden className="absolute inset-0 h-full w-full" fill="none">
        <motion.line
          x1="50%" y1="34%" x2="50%" y2="42%"
          stroke="rgba(45,152,241,0.3)" strokeWidth="1" strokeDasharray="3 3"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
        />
        <motion.line
          x1="50%" y1="60%" x2="50%" y2="68%"
          stroke="rgba(45,152,241,0.3)" strokeWidth="1" strokeDasharray="3 3"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.55 }}
        />
      </svg>

      {/* Badge bottom right */}
      <span
        aria-hidden
        className="absolute bottom-3 right-4 font-mono text-[7px] uppercase tracking-[0.18em] text-[#2d98f1]/25"
      >
        data stays yours
      </span>
    </div>
  )
}

const POINTS = [
  {
    icon: Server,
    title: "Deploy on your own infrastructure",
    body: "Run Vozpar entirely inside your cloud environment or on-premises servers. No third-party SaaS dependency for the voice engine itself.",
  },
  {
    icon: Lock,
    title: "Call data never leaves your environment",
    body: "Audio, transcripts, and extracted data are stored wherever you define. Vozpar does not retain call recordings by default.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance-ready architecture",
    body: "Designed to support HIPAA, GDPR, and SOC 2 workflows. Bring your own key management and audit-logging pipeline.",
  },
  {
    icon: Key,
    title: "Full credential control",
    body: "All API keys, carrier credentials, and integration tokens are stored in your vault — never in Vozpar's systems.",
  },
]

export function SelfHosted() {
  const reduced = useReducedMotion()

  return (
    <section id="self-hosted" className="relative overflow-hidden border-t border-white/[0.06]">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full blur-[160px]"
        style={{ background: "#046bd2", opacity: 0.05 }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left: copy */}
          <div>
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#046bd2]/30 bg-[#046bd2]/[0.08] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#2d98f1]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2d98f1]" />
                Data ownership
              </span>
              <h2 className="mt-5 text-balance font-heading text-4xl font-medium leading-[1.04] tracking-[-0.04em] text-white md:text-5xl">
                Your infrastructure.
                <br />
                <span className="bg-gradient-to-r from-[#2d98f1] to-[#046bd2] bg-clip-text text-transparent">
                  Your rules.
                </span>
              </h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-white/45">
                Vozpar is designed to run inside your perimeter. The voice engine,
                call data, and business knowledge all stay on infrastructure you control —
                giving you the privacy posture your compliance team requires.
              </p>
            </ScrollReveal>

            <StaggerGroup className="mt-10 grid gap-5 sm:grid-cols-2">
              {POINTS.map((p) => {
                const Icon = p.icon
                return (
                  <StaggerItem key={p.title}>
                    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#07090f] p-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2d98f1]/20 bg-[#046bd2]/10 text-[#2d98f1]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-semibold text-white">{p.title}</h3>
                      <p className="text-xs leading-relaxed text-white/40">{p.body}</p>
                    </div>
                  </StaggerItem>
                )
              })}
            </StaggerGroup>
          </div>

          {/* Right: illustration */}
          <ScrollReveal className="mx-auto w-full max-w-md lg:max-w-none">
            <InfraIllustration reduced={Boolean(reduced)} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
