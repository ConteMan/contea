export const defaultSetting = {
  key: 'weather',
  name: 'Weather',
  enable: true,
  site: 'https://weather.cma.cn',
  apiUrl: 'https://weather.cma.cn/api',
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
