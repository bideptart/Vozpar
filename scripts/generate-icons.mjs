/**
 * Generates every favicon / app-icon size the site needs from one master image.
 *
 *   1. Save your square master artwork as  public/app-icon.png  (1024px+ ideal)
 *   2. Run:  node scripts/generate-icons.mjs
 *
 * Produces:
 *   public/icon-16x16.png     browser tab (small)
 *   public/icon-32x32.png     browser tab (retina) + Windows taskbar
 *   public/icon-48x48.png     Windows / bookmark bar
 *   public/icon-192x192.png   Android home screen, PWA manifest
 *   public/icon-512x512.png   Android splash, PWA manifest
 *   public/apple-icon.png     iOS "Add to Home Screen" (180x180)
 *   public/og-icon.png        square social/share fallback (512x512)
 *
 * Also removes app/favicon.ico — Next.js gives that file priority over
 * everything in metadata.icons, so an old .ico silently wins over the new
 * PNGs and the tab keeps showing the previous logo.
 */

import sharp from "sharp"
import { existsSync, rmSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const SRC = join(root, "public", "app-icon.png")

if (!existsSync(SRC)) {
  console.error(
    "\n  Missing source image.\n" +
      "  Save your square logo as: public/app-icon.png\n" +
      "  then run this script again.\n"
  )
  process.exit(1)
}

const TARGETS = [
  { file: "icon-16x16.png", size: 16 },
  { file: "icon-32x32.png", size: 32 },
  { file: "icon-48x48.png", size: 48 },
  { file: "icon-192x192.png", size: 192 },
  { file: "icon-512x512.png", size: 512 },
  { file: "apple-icon.png", size: 180 },
  { file: "og-icon.png", size: 512 },
]

for (const { file, size } of TARGETS) {
  const out = join(root, "public", file)
  await sharp(SRC)
    // `fit: cover` keeps the artwork square-cropped rather than letterboxed;
    // the master is already square so this is a no-op safeguard.
    .resize(size, size, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(out)
  console.log(`  ✓ public/${file}  (${size}x${size})`)
}

// Legacy .ico would otherwise override everything above.
const legacyIco = join(root, "app", "favicon.ico")
if (existsSync(legacyIco)) {
  rmSync(legacyIco)
  console.log("  ✓ removed app/favicon.ico (was overriding the new icons)")
}

// The old hand-drawn vector stand-in is superseded by the real artwork.
const legacySvg = join(root, "public", "icon.svg")
if (existsSync(legacySvg)) {
  rmSync(legacySvg)
  console.log("  ✓ removed public/icon.svg (replaced by the real artwork)")
}

console.log("\n  Done. Restart the dev server and hard-refresh (Ctrl+Shift+R).\n")
