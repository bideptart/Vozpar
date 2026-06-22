import sharp from "sharp"
import { writeFile } from "node:fs/promises"
import { resolve } from "node:path"

const SRC = process.argv[2]
const root = resolve(process.cwd())

// Render the wide logo centered ("contain") on a transparent square canvas.
async function square(size, padRatio = 0.06) {
  const inner = Math.round(size * (1 - padRatio * 2))
  const logo = await sharp(SRC)
    .trim()
    .resize(inner, inner, { fit: "inside", withoutEnlargement: false })
    .toBuffer()
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toBuffer()
}

// Minimal ICO encoder that wraps PNG images (Vista+ format).
function buildIco(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(images.length, 4)

  const entries = []
  const datas = []
  let offset = 6 + images.length * 16
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0) // width (0 == 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1) // height
    entry.writeUInt8(0, 2) // palette
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // color planes
    entry.writeUInt16LE(32, 6) // bpp
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    entries.push(entry)
    datas.push(data)
    offset += data.length
  }
  return Buffer.concat([header, ...entries, ...datas])
}

async function run() {
  const out = async (rel, buf) => {
    await writeFile(resolve(root, rel), buf)
    console.log("wrote", rel, buf.length, "bytes")
  }

  // PNG app icons
  await out("public/icon-512x512.png", await square(512))
  await out("public/icon-192x192.png", await square(192))
  await out("public/apple-icon.png", await square(180))
  await out("public/icon-light-32x32.png", await square(32))
  await out("public/icon-dark-32x32.png", await square(32))

  // favicon.ico (16/32/48), Next.js serves app/favicon.ico at /favicon.ico
  const ico = buildIco([
    { size: 16, data: await square(16, 0.04) },
    { size: 32, data: await square(32, 0.04) },
    { size: 48, data: await square(48, 0.04) },
  ])
  await out("app/favicon.ico", ico)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
