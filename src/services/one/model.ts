import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
  token?: string // AccessToken
  enableTypes: string[]
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expried' | 'alarm' | 'showCard'>

export const setting: Config = {
  key: 'one',
  name: '一个',
  enable: true,
  site: 'http://wufazhuce.com/',
  apiUrl: '',
  expried: 86400,
  token: '',
  enableTypes: [],
  alarm: 60,
  showCard: true,
}
