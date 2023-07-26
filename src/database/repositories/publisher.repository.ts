import { Knex } from 'knex'

export class PublisherRepository {
  constructor(private readonly knex: Knex) {
  }

  public getPublisher = async (publisherId: string) => {
    const { rows } = await this.knex.raw(
      'SELECT * FROM publishers WHERE id = ?',
      [publisherId]
    )
    return rows[0]
  }
}
