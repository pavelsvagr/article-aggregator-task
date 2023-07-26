import { knex } from 'knex'
import { fakerEN as faker } from '@faker-js/faker'
import { User, UserState } from './models/user'
import { Article, ArticleState } from './models/article'
import { PublisherState } from './models/publisher'

const times = <R>(n: number, fn: (i: number) => R) => Array(n).fill(0).map((_,
  i) => fn(i))
const client = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'ackee_articles_docker',
    password: 'ackee_articles_docker',
    port: 5432
  }
})

const seedDb = async () => {
  console.log('TRUNCATING DATABASE')
  await client.table('articles_topics').delete()
  await client.table('topics').delete()
  await client.table('articles').delete()
  await client.table('publishers').delete()
  await client.table('users').delete()

  console.log('INSERTING NEW RECORDS')
  const ARTICLES_PER_DAY_MIN = 20_000
  const ARTICLES_PER_DAY_MAX = 70_000
  const START_DATE = new Date('2023-01-01')
  const DAYS = 20
  const ARTICLE_TOPICS_MIN = 1
  const ARTICLE_TOPICS_MAX = 8
  const AUTHORS = 10_000
  const TOPICS = {
    active: [
      'sport',
      'culture',
      'politics',
      'food',
      'people',
      'weather',
      'history',
      'health',
      'gaming',
      'nature'
    ],
    inactive: [
      'regional',
      'news',
      'army',
      'music',
      'film',
      'football',
      'water'
    ]
  }
  const PUBLISHERS = {
    active: [
      'news.cz',
      'politics.cz',
      'ct.cz',
      'topnews.cz',
      'daily-news.cz',
      'top.cz',
      'reader.com',
      'funnynews.com'
    ],
    banned: ['fakenews.com'],
    deleted: ['oportunity.cz', 'not-real-web.com']
  }
  console.log('- users')
  const authors: string[] = (await client.insert(times(AUTHORS, (): Omit<User, 'id' | 'create_time'> => ({
    full_name: faker.person.fullName(),
    password: faker.internet.password(),
    state: faker.helpers.enumValue(UserState),
    email: faker.internet.email()
  }))).into('users').returning('id')).map(a => a.id)

  console.log('- topics')
  const topics: string[] = (await client.insert([...TOPICS.active.map(name => ({
    name, is_active: true
  })), ...TOPICS.inactive.map(name => ({
    name, is_active: false
  }))]).into('topics').returning('id')).map(t => t.id)

  const fakePublisher = (name: string, state: PublisherState) => ({
    name,
    state,
    url: `https://${faker.helpers.slugify(name)}`,
    country: faker.helpers.arrayElement(['cs', 'sk'])
  })

  console.log('- publishers')
  const publishers = (await client.insert([
    ...PUBLISHERS.active.map(name => fakePublisher(name, PublisherState.ACTIVE)),
    ...PUBLISHERS.deleted.map(name => fakePublisher(name, PublisherState.DELETED)),
    ...PUBLISHERS.banned.map(name => fakePublisher(name, PublisherState.BANNED))
  ]).into('publishers').returning('id')).map(p => p.id)

  console.log('- articles')
  const fakeArticle = (date: Date): Omit<Article, 'id'> => {
    const title = faker.lorem.sentence()
    const state = faker.helpers.arrayElement([
      ...times(10, () => ArticleState.PUBLISHED), // 10 times higher change to be picked
      ...Object.values(ArticleState)
    ])

    const publishTime = new Date(date)
    publishTime.setHours(faker.number.int({ min: 0, max: 23 }), faker.number.int({
      min: 0,
      max: 59
    }))

    return {
      title,
      state,
      perex: faker.lorem.paragraph(),
      publish_time: [ArticleState.PUBLISHED, ArticleState.BANNED, ArticleState.DELETED].includes(state) ? publishTime : undefined,
      create_time: date,
      slug: `${faker.helpers.slugify(title)}-${faker.string.nanoid(5)}`,
      author_id: faker.helpers.arrayElement([faker.helpers.arrayElement(authors), undefined]),
      publisher_id: faker.helpers.arrayElement(publishers)
    }
  }

  for (let i = 0; i < DAYS; i++) {
    const date = new Date(START_DATE)
    date.setDate(START_DATE.getDate() + i)
    console.log(`  > articles for: ${date.toISOString().split('T')[0]}`)
    const count = faker.number.int({ min: ARTICLES_PER_DAY_MIN, max: ARTICLES_PER_DAY_MAX })

    const articleIds: string[] = (
      await client.batchInsert(
        'articles',
        times(count, () => fakeArticle(date)), 500
      ).returning('id' as any)
    ).map(a => a.id)

    const articleTopics = articleIds.map(articleId => times(faker.number.int({
      min: ARTICLE_TOPICS_MIN,
      max: ARTICLE_TOPICS_MAX
    }), () => ({
      article_id: articleId,
      topic_id: faker.helpers.arrayElement(topics)
    }))).flat(2)

    await client.batchInsert(
      'articles_topics', articleTopics)
  }
  console.log('DONE')
  process.exit()
}

void seedDb()
