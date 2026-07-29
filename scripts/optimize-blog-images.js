// Converts PNG blog images under public/blog/** to high-quality JPEG and
// rewrites the matching references in lib/blog.ts. PNG is wasteful for these
// photographic/gradient renders; JPEG at q=90 with 4:4:4 chroma (keeps
// colored heading text crisp) cuts file size ~80% with no visible loss.
//
// Usage: node scripts/optimize-blog-images.js
const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

const ROOT = path.join(__dirname, "..")
const BLOG_DIR = path.join(ROOT, "public", "blog")
const BLOG_TS = path.join(ROOT, "lib", "blog.ts")

async function run() {
  const folders = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => fs.statSync(path.join(BLOG_DIR, f)).isDirectory())

  let blogTs = fs.readFileSync(BLOG_TS, "utf8")
  let converted = 0

  for (const folder of folders) {
    const dir = path.join(BLOG_DIR, folder)
    const pngs = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".png"))

    for (const png of pngs) {
      const base = png.slice(0, -4)
      const jpgName = `${base}.jpg`
      const pngPath = path.join(dir, png)
      const jpgPath = path.join(dir, jpgName)

      const before = fs.statSync(pngPath).size
      const buf = await sharp(pngPath)
        .jpeg({ quality: 90, chromaSubsampling: "4:4:4", mozjpeg: true })
        .toBuffer()
      fs.writeFileSync(jpgPath, buf)
      fs.unlinkSync(pngPath)

      const refPattern = new RegExp(`(/blog/${folder}/${base})\\.png`, "g")
      blogTs = blogTs.replace(refPattern, "$1.jpg")

      console.log(
        `${folder}/${png.padEnd(20)} ${(before / 1024).toFixed(0)}KB -> ${jpgName} ${(buf.length / 1024).toFixed(0)}KB`
      )
      converted++
    }
  }

  fs.writeFileSync(BLOG_TS, blogTs)
  console.log(`\n${converted} image(s) converted, lib/blog.ts updated.`)
}

run()
