import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CATEGORIES, SLUG_TO_CATEGORY, SITE_CONFIG } from '@/lib/constants'
import { getProducts } from '@/lib/services/product.service'
import type { ProductCategory, ProductSortOption } from '@/types/product'
import { ProductGrid } from '@/components/product/product-grid'
import { SearchSortBar } from '@/components/search/search-sort-bar'
import { Pagination } from '@/components/common/pagination'
import { EmptyState } from '@/components/common/empty-state'

export const revalidate = 180 // 3분

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    q?: string
    sort?: string
    cursor?: string
  }>
}

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const categoryName = SLUG_TO_CATEGORY[slug]

  if (!categoryName) {
    return { title: '카테고리를 찾을 수 없습니다' }
  }

  return {
    title: `${categoryName}`,
    description: `${SITE_CONFIG.NAME}의 ${categoryName} 카테고리 상품을 만나보세요.`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params
  const { q, sort, cursor } = await searchParams

  const categoryName = SLUG_TO_CATEGORY[slug]
  if (!categoryName) {
    notFound()
  }

  const result = await getProducts({
    category: categoryName as ProductCategory,
    query: q,
    sort: (sort as ProductSortOption) || 'latest',
    startCursor: cursor,
  })

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">{categoryName}</h1>
        <p className="text-muted-foreground text-sm">
          {CATEGORIES.find(c => c.slug === slug)?.description}
        </p>
      </div>

      <Suspense>
        <SearchSortBar />
      </Suspense>

      {result.products.length === 0 ? (
        <EmptyState
          title="상품이 없습니다"
          description={
            q
              ? `"${q}"에 대한 검색 결과가 없습니다.`
              : '이 카테고리에 등록된 상품이 없습니다.'
          }
        />
      ) : (
        <>
          <ProductGrid products={result.products} />
          <Suspense>
            <Pagination
              hasMore={result.hasMore}
              nextCursor={result.nextCursor}
            />
          </Suspense>
        </>
      )}
    </div>
  )
}
