import type { Product } from '@/types/product'
import { ProductGrid } from '@/components/product/product-grid'

interface FeaturedProductsProps {
  title: string
  products: Product[]
  // 첫 번째 상품 이미지 우선 로딩 (LCP 최적화, 페이지 최상단 섹션에만 사용)
  prioritizeFirst?: boolean
}

export function FeaturedProducts({
  title,
  products,
  prioritizeFirst = false,
}: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <ProductGrid products={products} prioritizeFirst={prioritizeFirst} />
    </section>
  )
}
