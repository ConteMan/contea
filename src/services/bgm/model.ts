export const defaultSetting = {
  key: 'bgm',
  name: 'Bangumi',
  enable: true,
  site: 'https://bgm.tv',
  apiUrl: 'https://api.bgm.tv/v0',
  expried: 300,
  token: '',
  alarm: 10,
}

export type Config = {
  key: string
  name: string
  enable: boolean
  site: string
  apiUrl: string
  expried?: number
  token?: string // AccessToken
  alarm?: number
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'token' | 'alarm'>
