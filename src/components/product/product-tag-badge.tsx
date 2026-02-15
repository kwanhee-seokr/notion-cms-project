import { Badge } from '@/components/ui/badge'

interface ProductTagBadgeProps {
  tag: string
}

const TAG_VARIANTS: Record<string, { label: string; className: string }> = {
  BEST: {
    label: 'BEST',
    className: 'bg-red-500 text-white hover:bg-red-600',
  },
  NEW: {
    label: 'NEW',
    className: 'bg-blue-500 text-white hover:bg-blue-600',
  },
}

export function ProductTagBadge({ tag }: ProductTagBadgeProps) {
  const variant = TAG_VARIANTS[tag]
  if (!variant) return null

  return <Badge className={variant.className}>{variant.label}</Badge>
}

export function FreeShippingBadge() {
  return (
    <Badge variant="outline" className="text-xs">
      무료배송
    </Badge>
  )
}

export function TodayShipBadge() {
  return (
    <Badge variant="secondary" className="text-xs">
      오늘출발
    </Badge>
  )
}
