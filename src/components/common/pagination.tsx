'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronDown } from 'lucide-react'

interface PaginationProps {
  hasMore: boolean
  nextCursor: string | null
}

export function Pagination({ hasMore, nextCursor }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLoadMore = () => {
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

  // 표시할 항목이 없으면 렌더링하지 않음
  if (!hasMore && !hasCursor) return null

  return (
    <div className="flex flex-col items-center gap-3 pt-8">
      {/* 더 보기 버튼 */}
      {hasMore && nextCursor && (
        <Button
          variant="outline"
          size="lg"
          onClick={handleLoadMore}
          className="w-full max-w-xs"
        >
          <ChevronDown className="mr-2 h-4 w-4" />더 보기
        </Button>
      )}

      {/* 이전 페이지로 돌아가기 */}
      {hasCursor && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          className="text-muted-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          이전 페이지
        </Button>
      )}
    </div>
  )
}
