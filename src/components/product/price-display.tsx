import { formatCurrency, formatDiscountRate } from '@/lib/format'

interface PriceDisplayProps {
  price: number
  salePrice: number
  discountRate: number
}

export function PriceDisplay({
  price,
  salePrice,
  discountRate,
}: PriceDisplayProps) {
  const hasDiscount = discountRate > 0

  return (
    <div className="flex items-baseline gap-2">
      {hasDiscount && (
        <>
          <span className="text-destructive text-sm font-bold">
            {formatDiscountRate(discountRate)}
          </span>
          <span className="text-muted-foreground text-xs line-through">
            {formatCurrency(price)}
          </span>
        </>
      )}
      <span className="text-base font-bold">
        {formatCurrency(hasDiscount ? salePrice : price)}
      </span>
    </div>
  )
}
