import type { BaseConfig } from '@services/base/model'

export type Config = BaseConfig & {
  token: string // AccessToken
  gistUrl: string
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'token' | 'expired' | 'alarm' | 'showCard'>

export const setting: Config = {
  key: 'github',
  name: 'GitHub',
  enable: true,
  site: 'https://github.com',
  apiUrl: 'https://api.github.com',
  gistUrl: 'https://gist.github.com',
  expired: 3600,
  token: '',
  alarm: 60,
  showCard: true,
}

export const configKeys = Object.keys(setting)
