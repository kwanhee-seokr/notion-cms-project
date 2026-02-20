import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CATEGORY_TO_SLUG, SITE_CONFIG } from '@/lib/constants'
import { formatShipping } from '@/lib/format'
import {
  getProductById,
  getRelatedProducts,
} from '@/lib/services/product.service'
import { PriceDisplay } from '@/components/product/price-display'
import {
  ProductTagBadge,
  FreeShippingBadge,
  TodayShipBadge,
} from '@/components/product/product-tag-badge'
import { StoreLinkButton } from '@/components/product/store-link-button'
import { NotionContentRenderer } from '@/components/product/notion-content-renderer'
import { ProductGrid } from '@/components/product/product-grid'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export const revalidate = 60 // 1분

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const product = await getProductById(id)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const pageUrl = `${baseUrl}/product/${id}`
    const description = `${product.title} - ${SITE_CONFIG.NAME}에서 확인하세요.`

    return {
      title: product.title,
      description,
      alternates: { canonical: pageUrl },
      openGraph: {
        title: `${product.title} | ${SITE_CONFIG.NAME}`,
        description,
        url: pageUrl,
        type: 'website',
        images: product.imageUrl
          ? [{ url: product.imageUrl, alt: product.title }]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.title} | ${SITE_CONFIG.NAME}`,
        description,
        images: product.imageUrl ? [product.imageUrl] : [],
      },
    }
  } catch {
    return { title: '상품을 찾을 수 없습니다' }
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params

  let product
  try {
    product = await getProductById(id)
  } catch {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id)

  const categorySlug = CATEGORY_TO_SLUG[product.category]
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // Product JSON-LD
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.imageUrl || undefined,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.NAME,
    },
    offers: {
      '@type': 'Offer',
      url: product.storeLink,
      priceCurrency: 'KRW',
      price: product.salePrice ?? product.price,
      availability: 'https://schema.org/InStock',
    },
  }

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.category,
        item: `${baseUrl}/category/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `${baseUrl}/product/${id}`,
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* 브레드크럼 */}
      <nav className="text-muted-foreground mb-6 text-sm">
        <Link href="/" className="hover:text-foreground">
          홈
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/category/${categorySlug}`}
          className="hover:text-foreground"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      {/* 상품 상세 */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* 이미지 */}
        <div className="bg-muted relative aspect-square overflow-hidden rounded-lg">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">이미지 없음</span>
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="space-y-4">
          {/* 태그 */}
          <div className="flex gap-2">
            {product.tags.map(tag => (
              <ProductTagBadge key={tag} tag={tag} />
            ))}
            <Badge variant="outline">{product.category}</Badge>
          </div>

          <h1 className="text-2xl font-bold">{product.title}</h1>

          {/* 가격 */}
          <PriceDisplay
            price={product.price}
            salePrice={product.salePrice}
            discountRate={product.discountRate}
          />

          <Separator />

          {/* 배송 정보 */}
          <div className="space-y-2">
            <p className="text-sm">
              {formatShipping(product.shipping, product.freeShipping)}
            </p>
            <div className="flex gap-2">
              {product.freeShipping && <FreeShippingBadge />}
              {product.todayShip && <TodayShipBadge />}
            </div>
          </div>

          <Separator />

          {/* CTA */}
          <StoreLinkButton storeLink={product.storeLink} size="lg" />
        </div>
      </div>

      {/* 상세 설명 */}
      {product.content && product.content.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold">상품 상세</h2>
          <Separator className="mb-6" />
          <NotionContentRenderer blocks={product.content} />
        </div>
      )}

      {/* 추천 상품 */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold">관련 상품</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  )
}
