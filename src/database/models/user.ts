export enum UserState {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
}

export interface User {
  id: string
  full_name: string
  email: string
  password: string
  state: UserState
  last_login_time?: Date
}
