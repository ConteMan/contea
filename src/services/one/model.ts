export const defaultSetting = {
  key: 'one',
  name: '一个',
  enable: true,
  site: 'http://wufazhuce.com/',
  apiUrl: '',
  expried: 86400,
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
