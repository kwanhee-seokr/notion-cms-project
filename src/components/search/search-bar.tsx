'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useDebounceValue } from 'usehooks-ts'

interface SearchBarProps {
  placeholder?: string
  basePath?: string
}

export function SearchBar({
  placeholder = '상품명으로 검색...',
  basePath,
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') || '')
  const [debouncedValue] = useDebounceValue(value, 300)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // 첫 렌더링 시 스킵
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    if (debouncedValue) {
      params.set('q', debouncedValue)
    } else {
      params.delete('q')
    }
    params.delete('cursor')

    const path = basePath || window.location.pathname
    router.push(`${path}?${params.toString()}`)
  }, [debouncedValue, router, searchParams, basePath])

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}
