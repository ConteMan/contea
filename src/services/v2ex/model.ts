import type { types } from '~/enums/v2exEnum'
import type { BaseModule, BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
  url: string
  token?: string
  enableTypes?: types[]
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'token' | 'expried' | 'alarm' | 'showCard' | 'enableTypes'>

export const setting: Config = {
  key: 'v2ex',
  name: 'V2EX',
  enable: false,
  site: 'https://www.v2ex.com',
  url: 'https://www.v2ex.com',
  apiUrl: '',
  expried: 3600,
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

export type BaseUser = {
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

export type Mession = {
  date?: string
  completed?: boolean
  days?: number
}

export type InfoItem = {
  ca_module: string
  ca_module_type: string
  [other: string]: any
}

export type InfoList = InfoItem []

export type DomListItem = {
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
