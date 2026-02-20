import type { Product } from '@/types/product'
import { ProductCard } from './product-card'

interface ProductGridProps {
  products: Product[]
  // 첫 번째 카드 이미지 우선 로딩 여부 (LCP 최적화)
  prioritizeFirst?: boolean
}

export function ProductGrid({
  products,
  prioritizeFirst = false,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">상품이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={prioritizeFirst && index === 0}
        />
      ))}
    </div>
  )
}
