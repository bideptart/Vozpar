"use client"

import { useEffect, useState } from "react"
import { animate, motion, useReducedMotion } from "motion/react"

function Counter({ to, delay = 0 }: { to: number; delay?: number }) {
  const reduced = useReducedMotion()
  const [val, setVal] = useState(reduced ? to : 0)
  useEffect(() => {
    if (reduced) return
    const c = animate(0, to, {
      duration: 1.8, delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: v => setVal(Math.round(v)),
    })
    return () => c.stop()
  }, [to, delay, reduced])
  return <>{val.toLocaleString()}</>
}

const STATS = [
  { prefix: "<", value: 300, suffix: "ms",   label: "Voice Latency",      accent: true  },
  { prefix: "",  value: 99,  suffix: ".9%",  label: "Platform Uptime",    accent: true  },
  { prefix: "",  value: 30,  suffix: "+",    label: "Languages",          accent: false },
  { prefix: "",  value: 100, suffix: "+",    label: "Global Regions",     accent: false },
  { prefix: "",  value: 10,  suffix: "k+",   label: "Concurrent Calls",   accent: false },
]

export function TrustStrip() {
  return (
    <section className="relative border-y border-white/[0.06]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex flex-col items-center bg-[#000] px-5 py-8 text-center"
            >
              <p className={`font-heading text-3xl font-medium tabular-nums leading-none ${s.accent ? "text-[#2d98f1]" : "text-white"}`}>
                {s.prefix}<Counter to={s.value} delay={0.4 + i * 0.07} />{s.suffix}
              </p>
              <div className="mt-2 h-[2px] w-6 rounded-full bg-[#046bd2]/50" />
              <p className="mt-2 text-xs text-white/35">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
