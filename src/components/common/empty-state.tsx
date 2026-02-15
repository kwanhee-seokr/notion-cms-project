import { PackageOpen } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = '상품이 없습니다',
  description = '해당하는 상품을 찾을 수 없습니다.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <PackageOpen className="text-muted-foreground/40 mb-4 h-16 w-16" />
      <h3 className="mb-1 text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}
