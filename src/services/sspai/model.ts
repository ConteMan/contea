export const defaultSetting = {
  key: 'sspai',
  name: '少数派',
  enable: true,
  site: 'https://sspai.com',
  url: 'https://sspai.com',
  apiUrl: 'https://sspai.com/api/v1',
  cdnUrl: 'https://cdn.sspai.com',
  enableTypes: [],
  expried: 86400,
  alarm: 10,
}

export type Config = {
  key: string
  name: string
  enable: boolean
  site: string
  url: string
  apiUrl?: string
  cdnUrl?: string
  enableTypes: any[]
  expried: number
  alarm?: number
}

export type User = {
  updatedAt?: number
  expried?: number

  [propName: string]: any
}

export type Paginate = {
  limit: number
  offset: number
}
