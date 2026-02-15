'use client'

import { Suspense } from 'react'
import { SearchBar } from './search-bar'
import { SortSelect } from './sort-select'

export function SearchSortBar() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="w-full sm:max-w-sm">
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>
      <Suspense>
        <SortSelect />
      </Suspense>
    </div>
  )
}
