'use client'

import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StoreLinkButtonProps {
  storeLink: string
  size?: 'default' | 'sm' | 'lg'
}

export function StoreLinkButton({
  storeLink,
  size = 'default',
}: StoreLinkButtonProps) {
  if (!storeLink) return null

  return (
    <Button size={size} asChild className="w-full">
      <a href={storeLink} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="mr-2 h-4 w-4" />
        네이버에서 구매하기
      </a>
    </Button>
  )
}
