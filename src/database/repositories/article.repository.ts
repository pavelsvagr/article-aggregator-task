import { Knex } from 'knex'
import { ArticleState } from '../models/article'
import { getOffsetFromPage } from '../../utils/pagination.util'
import { PublisherState } from '../models/publisher'

export interface ArticleListParams {
  page: number
  limit: number
}

export class ArticleRepository {
  constructor(private readonly knex: Knex) {
  }

  public getNewestArticles = async ({ limit, page }: ArticleListParams) => {
    const { rows } = await this.knex.raw(
      'SELECT a.* FROM articles a JOIN publishers p ON (a.publisher_id = p.id) WHERE a.state = ? AND p.state != ? ORDER BY publish_time DESC, id LIMIT ? OFFSET ?',
      [ArticleState.PUBLISHED, PublisherState.BANNED, limit, getOffsetFromPage(page, limit)]
    )
    return rows
  }

  public getArticle = async (slug: string) => {
    const { rows } = await this.knex.raw(
      'SELECT a.* FROM articles a JOIN publishers p ON a.publisher_id = p.id WHERE a.state = ? AND p.state != ? AND slug = ?',
      [ArticleState.PUBLISHED, PublisherState.BANNED, slug]
    )
    return rows[0]
  }
}
