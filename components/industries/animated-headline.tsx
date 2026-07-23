"use client"

import { motion } from "motion/react"

/**
 * Word-by-word "assemble in" reveal for the big per-industry H2 headline —
 * styling/animation reference: onething.design/industries, whose case-style
 * headlines animate in rather than appearing as a static block. Each word is
 * masked (overflow-hidden) and slides up from behind that mask, staggered
 * left to right. Industries-page-only.
 */
export function AnimatedWords({
  text,
  stagger = 0.032,
  delay = 0,
}: {
  text: string
  stagger?: number
  delay?: number
}) {
  const words = text.split(" ")

  return (
    <motion.span
      className="inline"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "115%" },
              visible: { y: "0%" },
            }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
