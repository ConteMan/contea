import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
  url: string
  cdnUrl?: string
  enableTypes: any[]
}

export const setting = {
  key: 'sspai',
  name: '少数派',
  enable: true,
  site: 'https://sspai.com',
  url: 'https://sspai.com',
  apiUrl: 'https://sspai.com/api/v1',
  cdnUrl: 'https://cdn.sspai.com',
  enableTypes: [
    'index',
    'followActivity',
    'matrix',
  ],
  expried: 86400,
  alarm: 30,
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
