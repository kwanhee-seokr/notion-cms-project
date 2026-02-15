import { CATEGORIES } from '@/lib/constants'
import { CategoryCard } from './category-card'

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
      {CATEGORIES.map(category => (
        <CategoryCard key={category.slug} category={category} />
      ))}
    </div>
  )
}
