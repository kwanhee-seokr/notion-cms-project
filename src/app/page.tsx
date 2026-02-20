import { Suspense } from 'react'
import { CATEGORIES, PAGINATION } from '@/lib/constants'
import {
  getFeaturedProducts,
  getCategoryPreviewProducts,
} from '@/lib/services/product.service'
import { HeroBanner } from '@/components/sections/hero-banner'
import { FeaturedProducts } from '@/components/sections/featured-products'
import { CategoryPreview } from '@/components/sections/category-preview'
import { CategoryGrid } from '@/components/category/category-grid'
import { SearchBar } from '@/components/search/search-bar'

export const revalidate = 300 // 5분

export default async function HomePage() {
  // 병렬 데이터 페칭
  const [bestProducts, newProducts, ...categoryPreviews] = await Promise.all([
    getFeaturedProducts('BEST', 8),
    getFeaturedProducts('NEW', 8),
    ...CATEGORIES.map(c =>
      getCategoryPreviewProducts(c.name, PAGINATION.HOME_PREVIEW_COUNT)
    ),
  ])

  return (
    <div className="container mx-auto space-y-10 px-4 py-8">
      {/* 히어로 배너 */}
      <HeroBanner />

      {/* 검색바 */}
      <Suspense>
        <SearchBar
          placeholder="상품명으로 검색..."
          basePath="/category/furniture"
        />
      </Suspense>

      {/* 카테고리 그리드 */}
      <section>
        <h2 className="mb-4 text-xl font-bold">카테고리</h2>
        <CategoryGrid />
      </section>

      {/* BEST 상품 (최상단 노출 - 첫 번째 이미지 LCP 우선 로딩) */}
      <FeaturedProducts
        title="BEST 상품"
        products={bestProducts}
        prioritizeFirst
      />

      {/* NEW 상품 */}
      <FeaturedProducts title="NEW 상품" products={newProducts} />

      {/* 카테고리별 미리보기 */}
      {CATEGORIES.map((category, index) => (
        <CategoryPreview
          key={category.slug}
          category={category.name}
          products={categoryPreviews[index]}
        />
      ))}
    </div>
  )
}
