import Image from "next/image"
import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
  /** Pixel height of the rendered logo. Width auto-scales. */
  height?: number
  priority?: boolean
}

/**
 * 9278.ai wordmark — black-on-white JPEG.
 * Light: multiply drops the white bg against the off-white page.
 * Dark: invert flips to white-on-black, then screen drops the now-black bg.
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
        src="/9278-logo-black.jpeg"
        alt=""
        width={width}
        height={height}
        priority={priority}
        draggable={false}
        className="h-full w-auto select-none mix-blend-multiply dark:mix-blend-screen dark:invert"
      />
    </span>
  )
}
