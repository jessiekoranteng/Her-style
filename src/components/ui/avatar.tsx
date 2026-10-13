"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false)

    if (hasError || !src) {
      return (
        <div
          ref={ref}
          className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center text-white font-medium",
            className
          )}
          {...props}
        >
          {fallback || alt?.charAt(0).toUpperCase() || "?"}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        {/* A native image keeps this generic avatar compatible with arbitrary external URLs. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="aspect-square h-full w-full object-cover"
        />
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }
