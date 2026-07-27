import type { MetadataRoute } from "next"
import { SITE } from "@/lib/seo"

// Web app manifest — this is what Android/Chrome reads when someone taps
// "Add to Home Screen", and what gives the installed shortcut a proper
// full-size icon instead of a screenshot of the page. `purpose: "any
// maskable"` lets Android crop the icon into whatever shape the launcher
// uses (circle, squircle, rounded square) without clipping the artwork.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
