'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  hasMore: boolean
  nextCursor: string | null
}

export function Pagination({ hasMore, nextCursor }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleNext = () => {
    if (!nextCursor) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('cursor', nextCursor)
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const handlePrev = () => {
    // 커서 기반이므로 이전 페이지는 히스토리 back 사용
    router.back()
  }

  const hasCursor = searchParams.has('cursor')

  return (
    <div className="flex items-center justify-center gap-4 pt-6">
      {hasCursor && (
        <Button variant="outline" size="sm" onClick={handlePrev}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          이전
        </Button>
      )}
      {hasMore && nextCursor && (
        <Button variant="outline" size="sm" onClick={handleNext}>
          다음
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
