export const defaultSetting = {
  key: 'weread',
  name: '微信读书',
  site: 'https://weread.qq.com',
  apiUrl: 'https://weread.qq.com/web',
  apiUrl_2: 'https://i.weread.qq.com',
  expried: 1800,
}

export type Config = {
  key: string
  name: string
  site: string
  apiUrl: string
  apiUrl_2: string
  expried?: number
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