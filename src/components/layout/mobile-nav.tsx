'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Store } from 'lucide-react'
import { CATEGORIES, SITE_CONFIG } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            {SITE_CONFIG.NAME}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-sm font-medium"
          >
            홈
          </Link>
          <Separator />
          <p className="text-muted-foreground text-xs font-semibold uppercase">
            카테고리
          </p>
          {CATEGORIES.map(category => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {category.name}
            </Link>
          ))}
          <Separator />
          <a
            href={SITE_CONFIG.STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary flex items-center gap-1 text-sm font-medium"
          >
            <Store className="h-4 w-4" />
            스토어 바로가기
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}
