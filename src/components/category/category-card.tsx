import Link from 'next/link'
import {
  Sofa,
  Heart,
  ShoppingBag,
  Sparkles,
  Smartphone,
  Baby,
  Dumbbell,
  Shirt,
} from 'lucide-react'
import type { CategoryInfo } from '@/types/product'
import { Card, CardContent } from '@/components/ui/card'

// 아이콘 매핑
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sofa,
  Heart,
  ShoppingBag,
  Sparkles,
  Smartphone,
  Baby,
  Dumbbell,
  Shirt,
}

interface CategoryCardProps {
  category: CategoryInfo
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = ICON_MAP[category.icon]

  return (
    <Link href={`/category/${category.slug}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
          {Icon && <Icon className="text-primary h-8 w-8" />}
          <h3 className="text-sm font-medium">{category.name}</h3>
          <p className="text-muted-foreground line-clamp-1 text-xs">
            {category.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
