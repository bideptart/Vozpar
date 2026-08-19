"use client"

import { Globe2, PhoneForwarded, ShieldCheck } from "lucide-react"
import { motion } from "@/lib/motion"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

const items = [
  {
    icon: PhoneForwarded,
    title: "Bring your own number",
    description:
      "Already have a carrier account? Connect it and your existing numbers route through 9278.ai instantly — no porting, no downtime.",
  },
  {
    icon: Globe2,
    title: "Inbound and outbound",
    description:
      "One number, both directions. Trigger outbound campaigns or answer every incoming call automatically — same dashboard, same agent.",
  },
  {
    icon: ShieldCheck,
    title: "Carrier-grade voice",
    description:
      "Your provider's global network carries the call. We handle the brain. You keep the relationship, the billing, and the porting rights.",
  },
]

// Positions derived from each city's real lon/lat via the map's calibrated
// linear projection:  left% = 0.351*lon + 47.5,  top% = 56.3 - 0.687*lat.
// `flip` renders the label to the left of the pin (right-edge / crowded pins).
const cities = [
  { city: "New York", code: "+1", top: "28%", left: "22%", flip: false },
  { city: "São Paulo", code: "+55", top: "72%", left: "31%", flip: false },
  { city: "London", code: "+44", top: "21%", left: "47%", flip: true },
  { city: "Berlin", code: "+49", top: "20%", left: "52%", flip: false },
  { city: "Mumbai", code: "+91", top: "43%", left: "73%", flip: false },
  { city: "Tokyo", code: "+81", top: "32%", left: "95%", flip: true },
  { city: "Sydney", code: "+61", top: "80%", left: "96%", flip: true },
]

export function Connectivity() {
  return (
    <section className="relative overflow-hidden border-t border-border/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-24 md:px-6 md:py-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* LEFT: Copy + items */}
          <div className="lg:col-span-6">
            <ScrollReveal>
              <span className="ai-pill-violet">
                <Globe2 className="h-3 w-3" />
                Phone numbers
              </span>
              <h2 className="mt-6 text-balance font-heading text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-5xl">
                Your carrier account,{" "}
                <span className="text-primary">supercharged.</span>
              </h2>
              <p className="mt-5 text-pretty leading-relaxed text-muted-foreground md:text-lg">
                We don't sell phone numbers. We connect to the carrier you already use — so your numbers, billing, and
                porting stay exactly where they are.
              </p>
            </ScrollReveal>

            <StaggerGroup className="mt-10 flex flex-col gap-3">
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <StaggerItem key={item.title}>
                    <motion.div
                      className="group card-glow relative flex items-start gap-5 rounded-2xl p-5"
                      whileHover={{ x: 6 }}
                      transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-semibold tracking-tight transition-colors group-hover:text-primary">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.div>
                  </StaggerItem>
                )
              })}
            </StaggerGroup>
          </div>

          {/* RIGHT: World map nodes */}
          <ScrollReveal className="lg:col-span-6">
            <div className="ring-gradient relative aspect-[4/3] overflow-hidden rounded-3xl card-glow">
              {/* radial glow base */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.577_0.245_27.33/0.06),transparent_55%)]" />
              {/* world map silhouette — faint landmass fill */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.10]"
                style={{
                  backgroundColor: "oklch(0.577 0.245 27.33)",
                  WebkitMaskImage: "url(/world-map.svg)",
                  maskImage: "url(/world-map.svg)",
                  WebkitMaskSize: "cover",
                  maskSize: "cover",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                }}
              />
              {/* dotted world map — dots clipped to the continents */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    "radial-gradient(oklch(0.577 0.245 27.33 / 0.55) 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                  WebkitMaskImage: "url(/world-map.svg)",
                  maskImage: "url(/world-map.svg)",
                  WebkitMaskSize: "cover",
                  maskSize: "cover",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                }}
              />

              {/* connection arcs */}
              <svg
                aria-hidden
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 75"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="arc" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="oklch(0.577 0.245 27.33 / 0.0)" />
                    <stop offset="50%" stopColor="oklch(0.577 0.245 27.33 / 0.6)" />
                    <stop offset="100%" stopColor="oklch(0.646 0.222 14 / 0.0)" />
                  </linearGradient>
                </defs>
                {[
                  ["M22,21 Q35,6 47,15.75"],
                  ["M52,15 Q64,12 73,32.25"],
                  ["M73,32.25 Q86,22 95,24"],
                  ["M31,54 Q52,42 73,32.25"],
                  ["M95,24 Q101,44 96,60"],
                ].map(([d], i) => (
                  <path
                    key={i}
                    d={d}
                    fill="none"
                    stroke="url(#arc)"
                    strokeWidth="0.4"
                    strokeDasharray="0.6 0.4"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-2"
                      dur={`${4 + i * 0.6}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                ))}
              </svg>

              {/* city pins */}
              {cities.map((c, i) => (
                <motion.div
                  key={c.city}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.12 }}
                  className="absolute"
                  style={{ top: c.top, left: c.left }}
                >
                  <div className="relative -translate-x-1/2 -translate-y-1/2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_2px_oklch(0.577_0.245_27.33/0.6)]" />
                    </span>
                    <span
                      className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-border/50 bg-card/80 px-1.5 py-0.5 text-[10px] font-medium backdrop-blur ${
                        c.flip ? "right-3" : "left-3"
                      }`}
                    >
                      {c.code} <span className="text-muted-foreground">{c.city}</span>
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* center stat */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Active regions</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight">100+</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Avg uptime</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-primary">99.99%</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
