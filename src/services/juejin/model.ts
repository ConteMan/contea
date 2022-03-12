import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
  enableTypes: string[]
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm' | 'showCard'>

export const setting: Config = {
  key: 'juejin',
  name: '掘金',
  enable: false,
  site: 'https://juejin.cn',
  apiUrl: 'https://api.juejin.cn',
  expired: 3600,
  enableTypes: [],
  alarm: 60,
  showCard: true,
  contentScript: {
    enable: true,
    alarm: 10,
    url: 'https://juejin.cn',
  },
}
