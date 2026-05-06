// Converts the white-on-gray 9278.ai logo into a transparent PNG where
// luminance becomes alpha (white = opaque, gray = transparent).
// Run with: node scripts/make-logo-transparent.mjs

import sharp from "sharp"
import { readFile, writeFile } from "node:fs/promises"

const SRC = "public/9278-logo.png"
const OUT = "public/9278-logo-transparent.png"

const input = await readFile(SRC)

// Pull raw RGBA pixels.
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info

// For each pixel, set RGB to white and alpha to its luminance, with a contrast curve
// so the dark gray background goes to ~0 alpha while the bright white text stays at 255.
const out = Buffer.alloc(data.length)
const blackPoint = 70 // pixels darker than this become fully transparent
const whitePoint = 230 // pixels brighter than this become fully opaque
const range = whitePoint - blackPoint

for (let i = 0; i < data.length; i += channels) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  // Rec. 709 luminance
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
  let alpha = ((lum - blackPoint) / range) * 255
  if (alpha < 0) alpha = 0
  if (alpha > 255) alpha = 255
  out[i] = 255
  out[i + 1] = 255
  out[i + 2] = 255
  out[i + 3] = Math.round(alpha)
}

const png = await sharp(out, { raw: { width, height, channels: 4 } }).png().toBuffer()
await writeFile(OUT, png)
console.log(`[v0] wrote ${OUT} (${width}x${height})`)
