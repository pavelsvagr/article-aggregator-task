import { UserRepository } from '../database/repositories/user.repository'
import {
  ArticleListParams,
  ArticleRepository
} from '../database/repositories/article.repository'
import { Article } from '../database/models/article'
import { PublisherRepository } from '../database/repositories/publisher.repository'
import { TopicRepository } from '../database/repositories/topic.repository'

export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly userRepository: UserRepository,
    private readonly publisherRepository: PublisherRepository,
    private readonly topicRepository: TopicRepository
  ) {
  }

  public getNewestArticles = async (params: ArticleListParams) => {
    return this.enrichArticles(await this.articleRepository.getNewestArticles(params))
  }

  public getArticle = async (slug: string) => {
    const article = await this.articleRepository.getArticle(slug)
    return article ? (await this.enrichArticles([article]))[0] : null
  }

  private readonly enrichArticles = async (articles: Article[]) => {
    return Promise.all(articles.map(async article => {
      const { author_id, publisher_id, ...finalArticle } = article

      const [publisher, author, topics] = await Promise.all([
        this.publisherRepository.getPublisher(publisher_id),
        author_id ? this.userRepository.getUser(author_id) : Promise.resolve(null),
        this.topicRepository.getArticleTopics(article.id)
      ])
      return {
        ...finalArticle,
        publisher,
        author,
        topics
      }
    }))
  }
}
