import type { BaseConfig } from '@services/base/model'

export type Config = BaseConfig & {
  url: string
  cdnUrl?: string
  enableTypes: any[]
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm' | 'showCard' | 'enableTypes'>

export const setting: Config = {
  key: 'sspai',
  name: '少数派',
  enable: false,
  site: 'https://sspai.com',
  url: 'https://sspai.com',
  apiUrl: 'https://sspai.com/api/v1',
  cdnUrl: 'https://cdn.sspai.com',
  enableTypes: [
    'index',
    // 'followActivity',
    // 'matrix',
  ],
  expired: 3600,
  alarm: 30,
  showCard: false,
}

export const configKeys = Object.keys(setting)

export interface User {
  updatedAt?: number
  expired?: number

  [propName: string]: any
}

export interface Paginate {
  limit: number
  offset: number
}
