"use client"

import * as React from "react"
import { Toaster as SonnerToaster, type ToasterProps } from "sonner"
import { cn } from "@/lib/utils"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <SonnerToaster
      theme="system"
      className={cn(
        "toaster group",
        "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      )}
      toastOptions={{
        classNames: {
          toast: cn(
            "group flex w-full items-center gap-2 overflow-hidden rounded-xl border p-4",
            "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800",
            "shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
            "data-[swipe=cancel]:translate-x-0",
            "data-[swipe=end]:animate-out data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]"
          ),
          description: "text-sm text-slate-500 dark:text-slate-400",
          actionButton:
            "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-transparent bg-slate-100 px-3 text-sm font-medium text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
          cancelButton:
            "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-transparent bg-slate-100 px-3 text-sm font-medium text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }