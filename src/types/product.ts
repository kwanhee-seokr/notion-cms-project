/**
 * 상품 관련 타입 정의
 */

// 8개 카테고리
export type ProductCategory =
  | '가구/인테리어'
  | '생활/건강'
  | '패션잡화'
  | '화장품/미용'
  | '디지털/가전'
  | '출산/육아'
  | '스포츠/레저'
  | '패션의류'

// 상품 태그
export type ProductTag = 'BEST' | 'NEW'

// 상품 상태
export type ProductStatus = '초안' | '발행됨'

// 정렬 옵션
export type ProductSortOption =
  | 'latest'
  | 'price_asc'
  | 'price_desc'
  | 'discount'

// 상품 기본 타입
export interface Product {
  id: string
  title: string
  category: ProductCategory
  price: number
  salePrice: number
  discountRate: number
  imageUrl: string
  storeLink: string
  published: string
  status: ProductStatus
  tags: ProductTag[]
  shipping: number
  freeShipping: boolean
  todayShip: boolean
}

// 상품 상세 (Notion 블록 콘텐츠 포함)
export interface ProductDetail extends Product {
  content: NotionBlock[]
}

// Notion 블록 간소화 타입
export interface NotionBlock {
  id: string
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

// 상품 목록 조회 결과
export interface ProductListResult {
  products: Product[]
  nextCursor: string | null
  hasMore: boolean
}

// 카테고리 정보
export interface CategoryInfo {
  name: ProductCategory
  slug: string
  icon: string
  description: string
}
