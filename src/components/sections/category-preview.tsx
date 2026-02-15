import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Product, ProductCategory } from '@/types/product'
import { CATEGORY_TO_SLUG } from '@/lib/constants'
import { ProductGrid } from '@/components/product/product-grid'
import { Button } from '@/components/ui/button'

interface CategoryPreviewProps {
  category: ProductCategory
  products: Product[]
}

export function CategoryPreview({ category, products }: CategoryPreviewProps) {
  if (products.length === 0) return null

  const slug = CATEGORY_TO_SLUG[category]

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{category}</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/category/${slug}`}>
            전체 보기
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <ProductGrid products={products} />
    </section>
  )
}
