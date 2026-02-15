import type { Product } from '@/types/product'
import { ProductGrid } from '@/components/product/product-grid'

interface FeaturedProductsProps {
  title: string
  products: Product[]
}

export function FeaturedProducts({ title, products }: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <ProductGrid products={products} />
    </section>
  )
}
