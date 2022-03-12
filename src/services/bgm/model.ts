import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
  key: string
  name: string
  enable: boolean
  site: string
  apiUrl: string
  expired?: number
  token?: string // AccessToken
  alarm?: number
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl'| 'expired' | 'alarm'>

export const setting: Config = {
  key: 'bgm',
  name: 'Bangumi',
  enable: false,
  site: 'https://bgm.tv',
  apiUrl: 'https://api.bgm.tv/v0',
  expired: 3600,
  token: '',
  alarm: 60,
  showCard: false,
}
