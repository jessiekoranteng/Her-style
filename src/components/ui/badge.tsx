"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          {
            "bg-gradient-to-r from-indigo-600 to-purple-600 text-white":
              variant === "default",
            "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100":
              variant === "secondary",
            "bg-gradient-to-r from-red-600 to-rose-600 text-white":
              variant === "destructive",
            "border-2 border-slate-200 bg-transparent dark:border-slate-700":
              variant === "outline",
            "bg-gradient-to-r from-emerald-600 to-green-600 text-white":
              variant === "success",
            "bg-gradient-to-r from-amber-600 to-orange-600 text-white":
              variant === "warning",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }