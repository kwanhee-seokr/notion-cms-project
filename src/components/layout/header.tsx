import Link from 'next/link'
import { Store } from 'lucide-react'
import { CATEGORIES, SITE_CONFIG } from '@/lib/constants'
import { ThemeToggle } from '@/components/theme-toggle'
import { MobileNav } from './mobile-nav'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* 로고 */}
        <Link href="/" className="mr-6 flex items-center gap-2 font-bold">
          <Store className="h-5 w-5" />
          <span>{SITE_CONFIG.NAME}</span>
        </Link>

        {/* 데스크톱 내비게이션 */}
        <nav className="hidden flex-1 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>카테고리</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {CATEGORIES.map(category => (
                      <li key={category.slug}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/category/${category.slug}`}
                            className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                          >
                            <div className="text-sm leading-none font-medium">
                              {category.name}
                            </div>
                            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                              {category.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* 우측 액션 */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden sm:flex"
          >
            <a
              href={SITE_CONFIG.STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Store className="mr-1 h-4 w-4" />
              스토어 바로가기
            </a>
          </Button>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
