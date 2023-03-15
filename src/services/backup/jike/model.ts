import type { BaseConfig } from '@services/base/model'

export type Config = BaseConfig & {
  enableTypes: string[]
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm' | 'showCard'>

export const setting: Config = {
  key: 'jike',
  name: '即刻',
  enable: false,
  site: 'https://web.okjike.com',
  apiUrl: 'https://web-api.okjike.com/api/graphql',
  expired: 3600,
  enableTypes: [],
  alarm: 60,
  showCard: true,
}
