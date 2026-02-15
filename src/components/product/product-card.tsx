import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types/product'
import { Card, CardContent } from '@/components/ui/card'
import { PriceDisplay } from './price-display'
import {
  ProductTagBadge,
  FreeShippingBadge,
  TodayShipBadge,
} from './product-tag-badge'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/product/${product.id}`}>
        {/* 이미지 */}
        <div className="bg-muted relative aspect-square overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground text-sm">이미지 없음</span>
            </div>
          )}

          {/* 태그 뱃지 */}
          {product.tags.length > 0 && (
            <div className="absolute top-2 left-2 flex gap-1">
              {product.tags.map(tag => (
                <ProductTagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>

        {/* 정보 */}
        <CardContent className="p-3">
          <p className="text-muted-foreground mb-1 text-xs">
            {product.category}
          </p>
          <h3 className="mb-2 line-clamp-2 text-sm font-medium">
            {product.title}
          </h3>
          <PriceDisplay
            price={product.price}
            salePrice={product.salePrice}
            discountRate={product.discountRate}
          />
          <div className="mt-2 flex gap-1">
            {product.freeShipping && <FreeShippingBadge />}
            {product.todayShip && <TodayShipBadge />}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
