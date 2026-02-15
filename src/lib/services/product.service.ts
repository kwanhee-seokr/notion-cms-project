/**
 * 상품 데이터 서비스 레이어
 * Notion API를 통한 상품 CRUD 로직
 * 개발 환경에서 Notion 키가 없으면 Mock 데이터 사용
 */

import { ERROR_MESSAGES, PAGINATION } from '@/lib/constants'
import { isNotionConfigured } from '@/lib/env'
import { logger } from '@/lib/logger'
import {
  getMockFeaturedProducts,
  getMockProductById,
  getMockProducts,
} from '@/lib/mock-data'
import type {
  Product,
  ProductCategory,
  ProductDetail,
  ProductListResult,
  ProductSortOption,
  ProductTag,
} from '@/types/product'

// 조회 옵션
interface QueryOptions {
  query?: string
  sort?: ProductSortOption
  pageSize?: number
  startCursor?: string
}

// --- Notion API 로직 (API 키가 있을 때만 사용) ---

async function getNotionProducts(
  options: QueryOptions & { category?: ProductCategory }
): Promise<ProductListResult> {
  // 동적 import로 Notion 의존성 격리
  const { getDataSourceId, notion } = await import('@/lib/notion')
  const { transformNotionToProduct } = await import(
    '@/lib/utils/product-parser'
  )
  const { isProductPage } = await import('@/types/notion')
  type NotionPage = import('@/types/notion').NotionPage

  const {
    category,
    query,
    sort = 'latest',
    pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
    startCursor,
  } = options

  const dataSourceId = await getDataSourceId()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any[] = [{ property: '상태', select: { equals: '발행됨' } }]
  if (category) {
    filters.push({ property: '카테고리', select: { equals: category } })
  }
  if (query) {
    filters.push({ property: '상품명', title: { contains: query } })
  }

  const sortMap: Record<
    string,
    { property: string; direction: 'ascending' | 'descending' }[]
  > = {
    price_asc: [{ property: '할인가', direction: 'ascending' }],
    price_desc: [{ property: '할인가', direction: 'descending' }],
    latest: [{ property: '업데이트일', direction: 'descending' }],
  }

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    page_size: Math.min(pageSize, 100),
    start_cursor: startCursor || undefined,
    filter: filters.length === 1 ? filters[0] : { and: filters },
    sorts: sortMap[sort || 'latest'] || sortMap.latest,
  })

  let products = response.results
    .filter((page): page is NotionPage => 'properties' in page)
    .filter(isProductPage)
    .map(transformNotionToProduct)

  if (sort === 'discount') {
    products = products.sort((a, b) => b.discountRate - a.discountRate)
  }

  return {
    products,
    nextCursor: response.next_cursor,
    hasMore: response.has_more,
  }
}

async function getNotionProductById(pageId: string): Promise<ProductDetail> {
  const { notion, getPageBlocks } = await import('@/lib/notion')
  const { transformNotionToProduct } = await import(
    '@/lib/utils/product-parser'
  )
  const { isProductPage } = await import('@/types/notion')
  type NotionPage = import('@/types/notion').NotionPage

  const page = await notion.pages.retrieve({ page_id: pageId })

  if (!('properties' in page)) {
    throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
  }

  const notionPage = page as NotionPage
  if (!isProductPage(notionPage)) {
    throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
  }

  const product = transformNotionToProduct(notionPage)
  const content = await getPageBlocks(pageId)

  return { ...product, content }
}

async function getNotionFeaturedProducts(
  tag: ProductTag,
  limit: number
): Promise<Product[]> {
  const { getDataSourceId, notion } = await import('@/lib/notion')
  const { transformNotionToProduct } = await import(
    '@/lib/utils/product-parser'
  )
  const { isProductPage } = await import('@/types/notion')
  type NotionPage = import('@/types/notion').NotionPage

  const dataSourceId = await getDataSourceId()

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    page_size: limit,
    filter: {
      and: [
        { property: '상태', select: { equals: '발행됨' } },
        { property: '태그', multi_select: { contains: tag } },
      ],
    },
    sorts: [{ property: '업데이트일', direction: 'descending' }],
  })

  return response.results
    .filter((page): page is NotionPage => 'properties' in page)
    .filter(isProductPage)
    .map(transformNotionToProduct)
}

// --- 재시도 로직 ---

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | undefined

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (
        i === maxRetries - 1 ||
        lastError.message === ERROR_MESSAGES.PRODUCT_NOT_FOUND
      ) {
        throw lastError
      }

      const delay = Math.min(1000 * Math.pow(2, i), 5000)
      logger.warn('API 재시도', {
        attempt: i + 1,
        maxRetries: maxRetries - 1,
        delayMs: delay,
      })
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error('Retry failed')
}

// --- Public API (Mock/Notion 자동 전환) ---

/**
 * 상품 목록 조회
 */
export async function getProducts(
  options: QueryOptions & { category?: ProductCategory } = {}
): Promise<ProductListResult> {
  if (!isNotionConfigured) {
    return getMockProducts(options.category, options.query, options.pageSize)
  }

  try {
    return await getNotionProducts(options)
  } catch (error) {
    const errorObj = error as Error
    logger.error('상품 목록 조회 실패', {
      error: errorObj.message,
      category: options.category,
    })
    throw new Error(ERROR_MESSAGES.PRODUCT_LIST_ERROR)
  }
}

/**
 * 단일 상품 상세 조회
 */
export async function getProductById(pageId: string): Promise<ProductDetail> {
  if (!isNotionConfigured) {
    const product = getMockProductById(pageId)
    if (!product) throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND)
    return { ...product, content: [] }
  }

  return withRetry(() => getNotionProductById(pageId))
}

/**
 * 카테고리별 상품 조회
 */
export async function getProductsByCategory(
  category: ProductCategory,
  options: Omit<QueryOptions, 'category'> = {}
): Promise<ProductListResult> {
  return getProducts({ ...options, category })
}

/**
 * BEST/NEW 태그 상품 조회
 */
export async function getFeaturedProducts(
  tag: ProductTag,
  limit: number = PAGINATION.HOME_PREVIEW_COUNT
): Promise<Product[]> {
  if (!isNotionConfigured) {
    return getMockFeaturedProducts(tag, limit)
  }

  try {
    return await getNotionFeaturedProducts(tag, limit)
  } catch (error) {
    logger.error('추천 상품 조회 실패', { tag })
    throw error
  }
}

/**
 * 카테고리 미리보기 상품 (홈 페이지용)
 */
export async function getCategoryPreviewProducts(
  category: ProductCategory,
  limit: number = PAGINATION.HOME_PREVIEW_COUNT
): Promise<Product[]> {
  const result = await getProducts({ category, pageSize: limit })
  return result.products
}

/**
 * 추천 상품 (같은 카테고리, 현재 상품 제외)
 */
export async function getRelatedProducts(
  category: ProductCategory,
  excludeId: string,
  limit: number = 4
): Promise<Product[]> {
  const result = await getProducts({ category, pageSize: limit + 1 })
  return result.products.filter(p => p.id !== excludeId).slice(0, limit)
}
