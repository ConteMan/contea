namespace V2EX {
  export type types = 'all' | 'members' | 'hot' | 'tech'

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
  export interface cacheUser {
    ca_updated_at: string
    ca_expired_at: string
    data: User
  }
  
  export interface Module {
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
}