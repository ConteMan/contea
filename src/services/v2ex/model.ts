export type Config = {
  key: string
  enable: boolean
  name: string
  site: string
  url: string
  expried: number
  token?: string
  enableTypes?: any[]
  alarm?: number
}

export type BaseUser = {
  expried?: number
  username?: string
  login?: boolean
}

export type User = BaseUser & {
  updatedAt?: number
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

export type Mession = {
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
