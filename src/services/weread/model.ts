import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
  apiUrl_2: string
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm' | 'showCard'>

export const setting: Config = {
  key: 'weread',
  name: '微信读书',
  enable: false,
  site: 'https://weread.qq.com',
  apiUrl: 'https://weread.qq.com/web',
  apiUrl_2: 'https://i.weread.qq.com',
  expired: 3600,
  alarm: 60,
  showCard: true,
}

export interface BaseUser {
  userVid: number
}
export type User = BaseUser & {
  name?: string
  gender?: number
  avatar?: string
  isHide: number
  medalInfo?: {
    id: string
    desc: string
  }
  signature?: string
  location?: string
}

/**
 * 模块类型
 */
export enum ModuleType {
  MEMBER_CARD = 'memberCard',
  READ_DETAIL = 'readDetail',
}
