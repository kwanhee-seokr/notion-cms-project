import type { NotionBlock } from '@/types/product'

interface NotionContentRendererProps {
  blocks: NotionBlock[]
}

/**
 * Notion 블록을 HTML로 렌더링하는 서버 컴포넌트
 */
export function NotionContentRenderer({ blocks }: NotionContentRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {blocks.map(block => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}

function BlockRenderer({ block }: { block: NotionBlock }) {
  const richTextToString = (
    richText: Array<{ plain_text: string }> | undefined
  ): string => {
    return richText?.map(t => t.plain_text).join('') || ''
  }

  switch (block.type) {
    case 'paragraph':
      return <p>{richTextToString(block.paragraph?.rich_text)}</p>

    case 'heading_1':
      return <h1>{richTextToString(block.heading_1?.rich_text)}</h1>

    case 'heading_2':
      return <h2>{richTextToString(block.heading_2?.rich_text)}</h2>

    case 'heading_3':
      return <h3>{richTextToString(block.heading_3?.rich_text)}</h3>

    case 'bulleted_list_item':
      return (
        <ul>
          <li>{richTextToString(block.bulleted_list_item?.rich_text)}</li>
        </ul>
      )

    case 'numbered_list_item':
      return (
        <ol>
          <li>{richTextToString(block.numbered_list_item?.rich_text)}</li>
        </ol>
      )

    case 'quote':
      return <blockquote>{richTextToString(block.quote?.rich_text)}</blockquote>

    case 'divider':
      return <hr />

    case 'image': {
      const url =
        block.image?.type === 'external'
          ? block.image.external?.url
          : block.image?.file?.url
      const caption = richTextToString(block.image?.caption)
      return url ? (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={caption || '상품 이미지'}
            className="rounded-lg"
          />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      ) : null
    }

    default:
      return null
  }
}
