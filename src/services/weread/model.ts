import type { BaseConfig } from '@services/base/model'

export type Config = BaseConfig & {
  apiUrl_2: string
  shelfUrl: string
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm' | 'showCard'>

export const setting: Config = {
  key: 'weread',
  name: '微信读书',
  enable: false,
  site: 'https://weread.qq.com',
  apiUrl: 'https://weread.qq.com/web',
  apiUrl_2: 'https://i.weread.qq.com',
  shelfUrl: 'https://weread.qq.com/web/shelf',
  expired: 3600,
  alarm: 60,
  showCard: false,
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

export const configKeys = Object.keys(setting)
