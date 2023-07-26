export enum PublisherState {
  BANNED = 'BANNED',
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED'
}

export interface Publisher {
  id: string
  name: string
  url: string
  state: PublisherState
  country: string
  created_time: Date
}
