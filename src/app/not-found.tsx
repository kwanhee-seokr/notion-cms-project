import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5" />
              페이지를 찾을 수 없습니다
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <FileQuestion className="text-muted-foreground/40 h-24 w-24 sm:h-32 sm:w-32" />
              </div>
              <p className="text-muted-foreground/60 mb-2 text-8xl font-bold sm:text-9xl">
                404
              </p>
              <p className="text-muted-foreground text-lg">
                요청하신 페이지가 존재하지 않습니다.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="mb-2 font-semibold">확인 사항:</h3>
              <ul className="text-muted-foreground ml-4 list-disc space-y-1 text-sm">
                <li>URL 주소가 정확한지 확인해 주세요</li>
                <li>페이지가 삭제되었거나 이동되었을 수 있습니다</li>
                <li>홈 페이지에서 원하는 상품을 검색해 보세요</li>
              </ul>
            </div>

            <div className="flex justify-center pt-2">
              <Button asChild size="lg">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  홈으로 돌아가기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
