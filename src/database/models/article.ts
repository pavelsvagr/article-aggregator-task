export enum ArticleState {
  DRAFT = 'DRAFT',
  CREATED = 'CREATED',
  PUBLISHED = 'PUBLISHED',
  DELETED = 'DELETED',
  BANNED = 'BANNED'
}

export interface Article {
  id: string
  slug: string
  title: string
  state: ArticleState
  perex: string
  author_id?: string
  publisher_id: string
  create_time: Date
  publish_time?: Date
}
