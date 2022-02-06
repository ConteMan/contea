import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
  apiUrl_2: string
}

export const setting: Config = {
  key: 'weread',
  name: '微信读书',
  enable: true,
  site: 'https://weread.qq.com',
  apiUrl: 'https://weread.qq.com/web',
  apiUrl_2: 'https://i.weread.qq.com',
  expried: 3600,
  showCard: true,
}

export type BaseUser = {
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
