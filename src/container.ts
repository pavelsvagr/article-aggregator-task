import { ArticleController } from './controllers/article.controller'
import { ArticleRepository } from './database/repositories/article.repository'
import { knex } from 'knex'
import { UserRepository } from './database/repositories/user.repository'
import { ArticleService } from './services/article.service'
import { PublisherRepository } from './database/repositories/publisher.repository'
import { TopicRepository } from './database/repositories/topic.repository'

const client = knex({ client: 'pg', connection: { host: 'localhost', user: 'ackee_articles_docker', password: 'ackee_articles_docker', port: 5432 } })

const repositories = {
  article: new ArticleRepository(client),
  user: new UserRepository(client),
  publisher: new PublisherRepository(client),
  topic: new TopicRepository(client)
}

const services = {
  article: new ArticleService(repositories.article, repositories.user, repositories.publisher, repositories.topic)
}

export const controllers = {
  article: new ArticleController(services.article)
}
