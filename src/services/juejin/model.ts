import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
  enableTypes: string[]
}

export const setting = {
  key: 'juejin',
  name: '掘金',
  enable: true,
  site: 'https://juejin.cn',
  apiUrl: 'https://api.juejin.cn',
  expried: 3600,
  enableTypes: [],
  alarm: 60,
  showCard: true,
}
