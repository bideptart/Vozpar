import Image from "next/image"
import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
  /** Pixel height of the rendered logo. Width auto-scales. */
  height?: number
  priority?: boolean
}

/**
 * 9278.ai wordmark — white-on-transparent PNG.
 * Reads as-is on dark backgrounds; inverts in light mode so it stays visible.
 */
export function Logo({ className, height = 40, priority = false }: LogoProps) {
  const width = Math.round(height * 1.629)

  return (
    <span
      role="img"
      aria-label="9278.ai"
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
        className="h-full w-auto select-none invert dark:invert-0"
      />
    </span>
  )
}
