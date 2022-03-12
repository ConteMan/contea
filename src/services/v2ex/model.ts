import type { types } from '~/enums/v2exEnum'
import type { BaseConfig, BaseModule } from '~/services/base/model'

export type Config = BaseConfig & {
  url: string
  token?: string
  enableTypes?: types[]
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'token' | 'expired' | 'alarm' | 'showCard' | 'enableTypes'>

export const setting: Config = {
  key: 'v2ex',
  name: 'V2EX',
  enable: false,
  site: 'https://www.v2ex.com',
  url: 'https://www.v2ex.com',
  apiUrl: '',
  expired: 3600,
  token: '',
  enableTypes: [
    'all',
    'members',
    'hot',
    'tech',
  ],
  alarm: 30,
  showCard: true,
}

export interface BaseUser {
  username?: string
}

export type User = BaseUser & {
  id?: string
  created?: string
  dau?: string
  online?: string
  balance?: {
    gold?: string
    silver?: string
    bronze?: string
  }
  showName?: string
  signature?: string
  mission?: {
    date?: string
    days?: number
  }
}

export type Module = BaseModule & {
  data?: User
}

export interface Mission {
  date?: string
  completed?: boolean
  days?: number
}

export interface InfoItem {
  ca_module: string
  ca_module_type: string
  [other: string]: any
}

export type InfoList = InfoItem []

export interface DomListItem {
  ca_module: string
  ca_module_type: string
  ca_sort_at: number

  id?: number
  title?: string
  title_link?: string | null
  node?: string
  node_link?: string | null
  author?: string
  author_link?: string | null
  last_reply_at?: string | null
  reply_count?: number
}

export type DomList = DomListItem []
