import { Knex } from 'knex'
import { User, UserState } from '../models/user'

export class UserRepository {
  constructor(private readonly knex: Knex) {
  }

  public getUser = async (userId: string) => {
    const { rows } = await this.knex.raw(
      'SELECT * FROM users WHERE id = ? AND state = ? LIMIT 1',
      [userId, UserState.ACTIVE]
    )
    return rows[0]
  }

  public updateUser = (userId: string, update: Omit<Partial<User>, 'id'>) => {
    return this.knex.table('users').update(update).where('id', userId)
  }
}
