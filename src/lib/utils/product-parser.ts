/**
 * Notion 페이지를 Product 타입으로 변환하는 파서
 */

import type { Product, ProductCategory, ProductTag } from '@/types/product'
import type { NotionPage, ProductPageProperties } from '@/types/notion'

/**
 * Notion PageObjectResponse → Product 변환
 */
export function transformNotionToProduct(
  page: NotionPage & { properties: ProductPageProperties }
): Product {
  const props = page.properties

  const title =
    props.상품명?.title?.map(t => t.plain_text).join('') || '제목 없음'
  const category = (props.카테고리?.select?.name ||
    '생활/건강') as ProductCategory
  const price = props.원가?.number || 0
  const salePrice = props.할인가?.number || price
  const discountRate =
    price > 0 && salePrice < price
      ? Math.round(((price - salePrice) / price) * 100)
      : 0
  const imageUrl = props.이미지?.url || ''
  const storeLink = props.스토어링크?.url || ''
  const published = props.업데이트일?.date?.start || ''
  const status = (props.상태?.select?.name || '초안') as '초안' | '발행됨'
  const tags = (props.태그?.multi_select?.map(t => t.name) ||
    []) as ProductTag[]
  const shipping = props.배송비?.number || 0
  const freeShipping = props.무료배송?.checkbox || false
  const todayShip = props.오늘출발?.checkbox || false

  return {
    id: page.id,
    title,
    category,
    price,
    salePrice,
    discountRate,
    imageUrl,
    storeLink,
    published,
    status,
    tags,
    shipping,
    freeShipping,
    todayShip,
  }
}
