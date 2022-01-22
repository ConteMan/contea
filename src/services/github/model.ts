export const defaultSetting = {
  key: 'github',
  name: 'Github',
  enable: true,
  site: 'https://github.com',
  apiUrl: 'https://api.github.com',
  expried: 3600,
  token: '',
  enableTypes: [],
  alarm: 60,
}

export type Config = {
  key: string
  name: string
  enable: boolean
  site: string
  apiUrl: string
  expried?: number
  token?: string // AccessToken
  enableTypes: string[]
  alarm?: number
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'token' | 'alarm'>

export type StarredParams = {
  sort: string
  direction: string
  page: number
  per_page: number
}
