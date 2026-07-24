"use client"

import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { Calendar, Database, Phone, FileText, CheckCircle } from "lucide-react"

// ─── SVG integration network — Image 2 placeholder ───────────────────────────
// Replace with a real <Image> when artwork is available.
// Keeps the same bounding box so layout is stable on swap.

const NODES = [
  { id: "calendar", icon: Calendar, label: "Calendar",      x: "50%",  y: "12%",  tint: "#2d98f1" },
  { id: "crm",      icon: Database, label: "CRM",           x: "82%",  y: "38%",  tint: "#046bd2" },
  { id: "phone",    icon: Phone,    label: "Telephony",     x: "72%",  y: "76%",  tint: "#2d98f1" },
  { id: "kb",       icon: FileText, label: "Knowledge",     x: "28%",  y: "76%",  tint: "#046bd2" },
  { id: "done",     icon: CheckCircle, label: "Outcome",    x: "18%",  y: "38%",  tint: "#10b981" },
]

function IntegrationNetwork({ reduced }: { reduced: boolean }) {
  return (
    <div
      role="img"
      aria-label="Integration network: Vozpar at the centre connected to Calendar, CRM, Telephony, Knowledge Base, and Outcomes"
      className="relative w-full select-none"
      style={{ aspectRatio: "1 / 1" }}
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(4,107,210,0.14) 0%, transparent 70%)" }}
      />

      {/* SVG connector lines */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        {NODES.map((n) => {
          const cx = parseFloat(n.x) * 2
          const cy = parseFloat(n.y) * 2
          return (
            <motion.line
              key={n.id}
              x1="100" y1="100"
              x2={cx} y2={cy}
              stroke={n.tint}
              strokeWidth="0.8"
              strokeDasharray="3 3"
              initial={{ opacity: 0, pathLength: 0 }}
              whileInView={{ opacity: 0.4, pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: NODES.indexOf(n) * 0.15 }}
            />
          )
        })}
      </svg>

      {/* Satellite nodes */}
      {NODES.map((n, i) => {
        const Icon = n.icon
        return (
          <motion.div
            key={n.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: n.x, top: n.y }}
            initial={reduced ? undefined : { opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 + i * 0.1 }}
          >
            <div
              className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border backdrop-blur-sm"
              style={{
                borderColor: `${n.tint}35`,
                background: `linear-gradient(135deg, ${n.tint}14, rgba(0,0,0,0.6))`,
                boxShadow: `0 0 20px ${n.tint}18`,
              }}
            >
              <Icon className="h-5 w-5" style={{ color: n.tint }} />
            </div>
            <p
              className="mt-1 text-center font-mono text-[8px] uppercase tracking-[0.12em]"
              style={{ color: `${n.tint}70` }}
            >
              {n.label}
            </p>
          </motion.div>
        )
      })}

      {/* Centre — Vozpar core */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={reduced ? undefined : { opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {!reduced && (
          <motion.div
            className="absolute -inset-4 rounded-full border border-[#046bd2]/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        )}
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full border border-[#046bd2]/50 bg-[#000]"
          style={{ boxShadow: "0 0 40px rgba(4,107,210,0.4)" }}
        >
          <span className="font-heading text-[10px] font-bold tracking-widest text-[#2d98f1]">
            VZP
          </span>
        </div>
      </motion.div>
    </div>
  )
}

const POINTS = [
  "Checks calendar availability during the call",
  "Reads and writes to your CRM in real time",
  "Retrieves answers from your knowledge base",
  "Initiates or receives calls via your carrier",
  "Returns completed outcomes — not just transcripts",
]

export function Integrations() {
  const reduced = useReducedMotion()

  return (
    <section id="integrations" className="relative overflow-hidden border-t border-white/[0.06]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full blur-[160px]"
        style={{ background: "#046bd2", opacity: 0.055 }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left: copy */}
          <div>
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#046bd2]/30 bg-[#046bd2]/[0.08] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#2d98f1]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2d98f1]" />
                Integrations
              </span>
              <h2 className="mt-5 text-balance font-heading text-4xl font-medium leading-[1.04] tracking-[-0.04em] text-white md:text-5xl">
                Acts during the call,
                <br />
                <span className="bg-gradient-to-r from-[#2d98f1] to-[#046bd2] bg-clip-text text-transparent">
                  not after it.
                </span>
              </h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-white/45">
                Vozpar doesn't hand off to another system after the call ends.
                It queries your tools while the conversation is happening — so
                the caller gets a real answer, not a promise to follow up.
              </p>
            </ScrollReveal>

            <ul className="mt-8 space-y-3">
              {POINTS.map((p, i) => (
                <ScrollReveal key={p} delay={0.08 + i * 0.07}>
                  <li className="flex items-start gap-3 text-sm text-white/55">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#046bd2]/15 text-[#2d98f1]">
                      <CheckCircle className="h-3 w-3" />
                    </span>
                    {p}
                  </li>
                </ScrollReveal>
              ))}
            </ul>
          </div>

          {/* Right: network illustration */}
          <ScrollReveal className="w-full max-w-md lg:max-w-none mx-auto">
            <IntegrationNetwork reduced={Boolean(reduced)} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
