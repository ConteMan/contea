import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm' | 'showCard'>

export const setting: Config = {
  key: 'zhihu',
  name: '知乎',
  enable: false,
  site: 'https://www.zhihu.com',
  apiUrl: 'https://www.zhihu.com',
  alarm: 60,
  expired: 3600,
  showCard: true,
}

export interface HotParams {
  /**
   * 数量限制
   */
  limit: number
}
