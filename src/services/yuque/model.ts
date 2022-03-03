import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expried' | 'alarm' | 'showCard'>

export const setting: Config = {
  key: 'yuque',
  name: '语雀',
  enable: false,
  site: 'https://www.yuque.com',
  apiUrl: 'https://www.yuque.com/api',
  alarm: 60,
  expried: 3600,
  showCard: true,
}

export interface RecommendParams {
  /**
   * 数量限制
   */
  limit: number
  page: number
}
