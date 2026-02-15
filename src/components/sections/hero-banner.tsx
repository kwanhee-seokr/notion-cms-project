import Image from 'next/image'
import { Store } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { Button } from '@/components/ui/button'

export function HeroBanner() {
  return (
    <section className="overflow-hidden rounded-xl">
      {/* 브랜드 메인 이미지 */}
      <div className="relative aspect-[5/2] w-full">
        <Image
          src="/images/brand/jangs-living-notion-cover.png"
          alt={`${SITE_CONFIG.NAME} - ${SITE_CONFIG.SLOGAN}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
      </div>
      {/* CTA 버튼 */}
      <div className="bg-card px-6 py-5 text-center">
        <Button size="lg" asChild>
          <a
            href={SITE_CONFIG.STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Store className="mr-2 h-4 w-4" />
            스마트스토어 방문하기
          </a>
        </Button>
      </div>
    </section>
  )
}
