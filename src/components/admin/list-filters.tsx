"use client"

import { FormEvent, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Search } from "lucide-react"

interface FilterOption {
  value: string
  label: string
}

interface ListFiltersProps {
  search?: string
  searchPlaceholder: string
  filterName?: string
  filterValue?: string
  filterLabel?: string
  options?: FilterOption[]
}

export function ListFilters({
  search = "",
  searchPlaceholder,
  filterName,
  filterValue = "",
  filterLabel,
  options = [],
}: ListFiltersProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [searchValue, setSearchValue] = useState(search)
  const [selectedFilter, setSelectedFilter] = useState(filterValue)

  function navigate(nextSearch: string, nextFilter: string) {
    const params = new URLSearchParams()
    if (nextSearch.trim()) params.set("search", nextSearch.trim())
    if (filterName && nextFilter) params.set(filterName, nextFilter)
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(searchValue, selectedFilter)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        />
      </div>
      {filterName && filterLabel ? (
        <select
          aria-label={filterLabel}
          value={selectedFilter}
          className="h-11 px-4 border border-neutral-300 rounded-lg bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          onChange={(event) => {
            const value = event.target.value
            setSelectedFilter(value)
            navigate(searchValue, value)
          }}
        >
          <option value="">All {filterLabel}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
      <button type="submit" className="btn-outline sm:px-6">
        Search
      </button>
    </form>
  )
}
