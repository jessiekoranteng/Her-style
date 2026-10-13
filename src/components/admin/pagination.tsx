"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams: Record<string, string>
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null

  const prevPage = Math.max(1, currentPage - 1)
  const nextPage = Math.min(totalPages, currentPage + 1)

  const params = new URLSearchParams(searchParams)
  params.set("page", String(prevPage))
  const prevUrl = `${baseUrl}?${params.toString()}`

  params.set("page", String(nextPage))
  const nextUrl = `${baseUrl}?${params.toString()}`

  return (
    <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
      <p className="text-sm text-neutral-600">
        Showing page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Link
          href={prevUrl}
          className={cn(
            "h-10 px-4 rounded-lg border border-neutral-300 text-sm font-medium transition-colors",
            currentPage === 1 ? "bg-neutral-100 text-neutral-400 cursor-not-allowed" : "bg-white text-neutral-700 hover:bg-neutral-50"
          )}
          aria-disabled={currentPage === 1}
        >
          Previous
        </Link>
        <Link
          href={nextUrl}
          className={cn(
            "h-10 px-4 rounded-lg border border-neutral-300 text-sm font-medium transition-colors",
            currentPage === totalPages ? "bg-neutral-100 text-neutral-400 cursor-not-allowed" : "bg-white text-neutral-700 hover:bg-neutral-50"
          )}
          aria-disabled={currentPage === totalPages}
        >
          Next
        </Link>
      </div>
    </div>
  )
}