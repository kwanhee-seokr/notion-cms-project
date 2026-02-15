import { Client } from '@notionhq/client'
import { env } from './env'
import { logger } from './logger'

export const notion = new Client({
  auth: env.NOTION_API_KEY,
  notionVersion: '2025-09-03',
})

export async function getNotionPage(pageId: string) {
  try {
    return await notion.pages.retrieve({ page_id: pageId })
  } catch (error) {
    logger.error('Notion API 오류', {
      pageId,
    })
    throw error
  }
}

/**
 * 데이터베이스의 data_source_id를 조회하고 캐싱합니다.
 * Notion API v5에서는 database_id 대신 data_source_id를 사용해야 합니다.
 */
let cachedDataSourceId: string | null = null

export async function getDataSourceId(): Promise<string> {
  if (cachedDataSourceId) {
    return cachedDataSourceId
  }

  try {
    const response = await notion.databases.retrieve({
      database_id: env.NOTION_DATABASE_ID,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataSources = (response as any).data_sources

    if (!dataSources || dataSources.length === 0) {
      throw new Error('데이터베이스에 data source가 없습니다')
    }

    const dataSourceId = dataSources[0].id
    cachedDataSourceId = dataSourceId
    logger.info('Data Source ID 캐싱 완료', {
      dataSourceId,
    })

    return dataSourceId
  } catch (error) {
    logger.error('Data Source ID 조회 실패', {
      databaseId: env.NOTION_DATABASE_ID,
      error,
    })
    throw error
  }
}

/**
 * 페이지의 자식 블록(본문 콘텐츠) 조회
 */
export async function getPageBlocks(pageId: string) {
  try {
    const blocks = []
    let cursor: string | undefined = undefined

    do {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      })

      blocks.push(...response.results)
      cursor = response.has_more ? response.next_cursor : undefined
    } while (cursor)

    return blocks
  } catch (error) {
    logger.error('페이지 블록 조회 실패', { pageId })
    throw error
  }
}
