/**
 * Notion DB 속성 매핑 타입
 */

import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

// Notion 페이지 타입 alias
export type NotionPage = PageObjectResponse

// 상품 페이지 속성 (Notion DB 한글 속성명)
export interface ProductPageProperties {
  상품명: { title: Array<{ plain_text: string }> }
  카테고리: { select: { name: string } | null }
  원가: { number: number | null }
  할인가: { number: number | null }
  이미지: { url: string | null }
  스토어링크: { url: string | null }
  업데이트일: { date: { start: string } | null }
  상태: { select: { name: string } | null }
  태그: { multi_select: Array<{ name: string }> }
  배송비: { number: number | null }
  무료배송: { checkbox: boolean }
  오늘출발: { checkbox: boolean }
}

// 타입 가드: 상품 페이지 여부 확인
export function isProductPage(
  page: NotionPage
): page is NotionPage & { properties: ProductPageProperties } {
  const props = page.properties
  return '상품명' in props && '카테고리' in props
}
