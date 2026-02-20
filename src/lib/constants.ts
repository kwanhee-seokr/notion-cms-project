/**
 * 애플리케이션 전역 상수 정의
 */

import type { CategoryInfo, ProductSortOption } from '@/types/product'

// 사이트 설정
export const SITE_CONFIG = {
  NAME: 'Jangs 리빙',
  SLOGAN: '생활의 품격을 높이는 스마트한 선택',
  DESCRIPTION:
    'Jangs 리빙 스마트스토어에서 엄선한 가구, 생활용품, 패션잡화, 화장품 등 다양한 상품을 만나보세요.',
  STORE_URL: 'https://smartstore.naver.com/jangsliving',
} as const

// 8개 카테고리
export const CATEGORIES: CategoryInfo[] = [
  {
    name: '가구/인테리어',
    slug: 'furniture',
    icon: 'Sofa',
    description: '공간을 완성하는 가구와 인테리어 소품',
  },
  {
    name: '생활/건강',
    slug: 'living',
    icon: 'Heart',
    description: '건강한 일상을 위한 생활용품',
  },
  {
    name: '패션잡화',
    slug: 'fashion-accessories',
    icon: 'ShoppingBag',
    description: '스타일을 완성하는 패션 잡화',
  },
  {
    name: '화장품/미용',
    slug: 'beauty',
    icon: 'Sparkles',
    description: '아름다움을 위한 뷰티 아이템',
  },
  {
    name: '디지털/가전',
    slug: 'digital',
    icon: 'Smartphone',
    description: '스마트한 생활을 위한 디지털 가전',
  },
  {
    name: '출산/육아',
    slug: 'baby',
    icon: 'Baby',
    description: '아이와 함께하는 행복한 육아',
  },
  {
    name: '스포츠/레저',
    slug: 'sports',
    icon: 'Dumbbell',
    description: '활력 넘치는 스포츠와 레저',
  },
  {
    name: '패션의류',
    slug: 'clothing',
    icon: 'Shirt',
    description: '매일 입고 싶은 패션 의류',
  },
] as const

// 슬러그 ↔ 카테고리명 양방향 맵
export const SLUG_TO_CATEGORY = Object.fromEntries(
  CATEGORIES.map(c => [c.slug, c.name])
) as Record<string, string>

export const CATEGORY_TO_SLUG = Object.fromEntries(
  CATEGORIES.map(c => [c.name, c.slug])
) as Record<string, string>

// 정렬 옵션
export const SORT_OPTIONS: {
  value: ProductSortOption
  label: string
}[] = [
  { value: 'latest', label: '최신순' },
  { value: 'price_asc', label: '가격 낮은순' },
  { value: 'price_desc', label: '가격 높은순' },
  { value: 'discount', label: '할인율순' },
]

// 페이지네이션
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  HOME_PREVIEW_COUNT: 4,
} as const

// ISR 재검증 주기 (초)
export const REVALIDATE = {
  HOME: 300,
  CATEGORY: 180,
  PRODUCT: 60,
} as const

// 에러 메시지
export const ERROR_MESSAGES = {
  PRODUCT_NOT_FOUND: '상품을 찾을 수 없습니다.',
  CATEGORY_NOT_FOUND: '카테고리를 찾을 수 없습니다.',
  NOTION_API_ERROR: 'Notion API 연결 오류가 발생했습니다.',
  PRODUCT_LIST_ERROR: '상품 목록을 불러올 수 없습니다.',
  SEARCH_ERROR: '상품 검색에 실패했습니다.',
} as const

// 통화 포맷
export const CURRENCY_FORMAT = {
  LOCALE: 'ko-KR',
  CURRENCY: 'KRW',
  SYMBOL: '₩',
} as const
