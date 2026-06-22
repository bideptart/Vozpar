import Image from "next/image"
import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
  /** Pixel height of the rendered logo. Width auto-scales. */
  height?: number
  priority?: boolean
  /** Logo asset to render. Use "/logo-white.png" on dark backgrounds. */
  src?: string
}

/**
 * 9278.ai brand logo — full-colour (black + red headset) on transparent.
 * Use the default `/logo.png` on light surfaces and `/logo-white.png` on dark ones.
 */
export function Logo({ className, height = 40, priority = false, src = "/logo.png" }: LogoProps) {
  const width = Math.round(height * 2.285)

  return (
    <span
      role="img"
      aria-label="9278.ai"
      className={cn("inline-flex items-center", className)}
      style={{ height }}
    >
      <Image
        src={src}
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
