import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
  enableTypes: string[]
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expried' | 'alarm' | 'showCard'>

export const setting = {
  key: 'juejin',
  name: '掘金',
  enable: false,
  site: 'https://juejin.cn',
  apiUrl: 'https://api.juejin.cn',
  expried: 3600,
  enableTypes: [],
  alarm: 60,
  showCard: true,
}
