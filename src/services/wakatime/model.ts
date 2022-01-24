export const defaultSetting = {
  key: 'wakatime',
  name: 'WakaTime',
  enable: true,
  site: 'https://wakatime.com',
  apiUrl: 'https://wakatime.com/api/v1',
  expried: 600,
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
  token?: string
  enableTypes?: string[]
  alarm?: number
}
