import { Knex } from 'knex'

export interface TopicsListParams {
  page: number
  limit: number
}

export interface GetArticleTopicsParams extends TopicsListParams {
  articleId: string
}

export class TopicRepository {
  constructor(private readonly knex: Knex) {
  }

  public getArticleTopics = async (articleId: string) => {
    const { rows } = await this.knex.raw(
      'SELECT t.* FROM topics t JOIN articles_topics at ON (t.id = at.topic_id) JOIN articles a ON (a.id = at.article_id) WHERE t.is_active = ? AND a.id = ?',
      [true, articleId]
    )
    return rows
  }

  public getTopic = async (id: string) => {
    const { rows } = await this.knex.raw(
      'SELECT t.* FROM topics t WHERE id = ? LIMIT 1',
      [id]
    )
    return rows[0]
  }
}
