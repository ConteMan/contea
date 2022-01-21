export const defaultSetting = {
  key: 'juejin',
  name: '掘金',
  enable: true,
  site: 'https://juejin.cn',
  apiUrl: 'https://api.juejin.cn',
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
