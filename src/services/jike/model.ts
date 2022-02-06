import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
  enableTypes: string[]
}

export const setting: Config = {
  key: 'jike',
  name: '即刻',
  enable: true,
  site: 'https://web.okjike.com',
  apiUrl: 'https://web-api.okjike.com/api/graphql',
  expried: 3600,
  enableTypes: [],
  alarm: 60,
  showCard: true,
}
