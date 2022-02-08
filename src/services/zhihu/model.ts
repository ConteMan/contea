import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
}

export const setting: Config = {
  key: 'zhihu',
  name: '知乎',
  enable: true,
  site: 'https://www.zhihu.com',
  apiUrl: 'https://www.zhihu.com',
  alarm: 60,
  expried: 3600,
  showCard: true,
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expried' | 'alarm' | 'showCard'>

export type HotParams = {
  /**
   * 数量限制
   */
  limit: number
}
