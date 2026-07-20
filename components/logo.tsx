import Image from "next/image"
import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
  /** Pixel height of the rendered logo. Width auto-scales. */
  height?: number
  priority?: boolean
  /** Kept for backwards compatibility; ignored (the wordmark is baked into the asset). */
  src?: string
}

// Full Vozpar logo (bar-chart + swoosh "V" + "ozpar" wordmark) — transparent PNG.
// The white wordmark is designed for dark surfaces, which is the site's theme.
const LOGO_ASPECT = 1114 / 383

/**
 * Vozpar brand logo. Renders the official transparent logo asset as-is.
 */
export function Logo({ className, height = 40, priority = false }: LogoProps) {
  const width = Math.round(height * LOGO_ASPECT)

  return (
    <span
      role="img"
      aria-label="Vozpar"
      className={cn("inline-flex items-center", className)}
      style={{ height }}
    >
      <Image
        src="/logo.png"
        alt=""
        width={width}
        height={height}
        priority={priority}
        draggable={false}
        className="h-full w-auto select-none"
      />
    </span>
  )
}
