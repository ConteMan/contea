import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
  key: string
  name: string
  enable: boolean
  site: string
  apiUrl: string
  expried?: number
  token?: string // AccessToken
  alarm?: number
}

export const setting: Config = {
  key: 'bgm',
  name: 'Bangumi',
  enable: true,
  site: 'https://bgm.tv',
  apiUrl: 'https://api.bgm.tv/v0',
  expried: 3600,
  token: '',
  alarm: 10,
  showCard: false,
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'token' | 'alarm' | 'showCard'>
