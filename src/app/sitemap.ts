import type { MetadataRoute } from 'next'
import { CATEGORIES } from '@/lib/constants'
import { getProducts } from '@/lib/services/product.service'
import type { ProductCategory } from '@/types/product'

// 1시간마다 재생성
export const revalidate = 3600

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // 정적 URL: 홈 + 8개 카테고리
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...CATEGORIES.map(category => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    })),
  ]

  // 동적 상품 URL: 카테고리별 첫 페이지 상품 포함
  const productUrls: MetadataRoute.Sitemap = []

  for (const category of CATEGORIES) {
    try {
      const result = await getProducts({
        category: category.name as ProductCategory,
      })
      result.products.forEach(product => {
        productUrls.push({
          url: `${baseUrl}/product/${product.id}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      })
    } catch {
      // 개별 카테고리 조회 실패 시 해당 카테고리 건너뜀
    }
  }

  return [...staticUrls, ...productUrls]
}
