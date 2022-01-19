export const defaultSetting = {
  key: 'jike',
  name: '即刻',
  enable: true,
  site: 'https://web.okjike.com',
  apiUrl: 'https://web-api.okjike.com/api/graphql',
  expried: 300,
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
  enableTypes: string[]
  alarm?: number
}
