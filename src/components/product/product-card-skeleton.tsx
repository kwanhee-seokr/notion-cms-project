import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-3">
        <Skeleton className="mb-1 h-3 w-16" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-5 w-24" />
      </CardContent>
    </Card>
  )
}
