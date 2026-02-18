/**
 * 개발용 Mock 데이터
 * Notion API 키가 설정되지 않았을 때 사용
 */

import type { Product, ProductCategory, ProductTag } from '@/types/product'
import { CATEGORIES } from './constants'

function createMockProduct(
  id: number,
  category: ProductCategory,
  tags: ProductTag[] = []
): Product {
  const price = Math.floor(Math.random() * 50000) + 5000
  const hasDiscount = Math.random() > 0.3
  const salePrice = hasDiscount
    ? Math.floor(price * (0.6 + Math.random() * 0.3))
    : price
  const discountRate =
    hasDiscount && price > 0
      ? Math.round(((price - salePrice) / price) * 100)
      : 0

  return {
    id: `mock-${id}`,
    title: `[${category}] 샘플 상품 ${id}`,
    category,
    price,
    salePrice,
    discountRate,
    imageUrl: '',
    storeLink: 'https://smartstore.naver.com/jangsliving',
    published: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    status: '발행됨',
    tags,
    shipping: Math.random() > 0.5 ? 3000 : 0,
    freeShipping: Math.random() > 0.5,
    todayShip: Math.random() > 0.7,
  }
}

// 카테고리별 Mock 상품 생성
let idCounter = 1
export const MOCK_PRODUCTS: Product[] = CATEGORIES.flatMap(cat => {
  const count = 8
  return Array.from({ length: count }, (_, i) => {
    const tags: ProductTag[] = []
    if (i < 2) tags.push('BEST')
    if (i >= 2 && i < 4) tags.push('NEW')
    return createMockProduct(idCounter++, cat.name, tags)
  })
})

export function getMockProducts(
  category?: ProductCategory,
  query?: string,
  pageSize: number = 12
): { products: Product[]; nextCursor: string | null; hasMore: boolean } {
  let filtered = MOCK_PRODUCTS

  if (category) {
    filtered = filtered.filter(p => p.category === category)
  }

  if (query) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    )
  }

  const products = filtered.slice(0, pageSize)
  return {
    products,
    nextCursor: filtered.length > pageSize ? 'mock-cursor' : null,
    hasMore: filtered.length > pageSize,
  }
}

export function getMockProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find(p => p.id === id)
}

export function getMockFeaturedProducts(
  tag: ProductTag,
  limit: number = 4
): Product[] {
  return MOCK_PRODUCTS.filter(p => p.tags.includes(tag)).slice(0, limit)
}
