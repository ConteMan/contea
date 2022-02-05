export const defaultSetting = {
  key: 'wallpaper',
  name: 'Wallpaper',
  enable: true,
  site: '',
  apiUrl: '',
  expried: 3600,
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
