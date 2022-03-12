export interface BaseConfig {
  key: string
  name: string // 模块名称
  enable: boolean // 是否启用
  site: string // 站点 URL
  apiUrl: string // API URL
  expired: number // 缓存时间，单位：秒
  showCard?: boolean // 是否显示卡片
  alarm?: number // 定时任务时间，单位：分钟
  contentScript?: {
    enable: boolean
    alarm: number
    url: string
  }
  [other: string]: any
}

export type Config = BaseConfig & {
  showCards: string[]
  defaultPath: string
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'expired' | 'alarm'>

export const setting: Config = {
  key: 'base',
  name: '基础',
  enable: true,
  site: '',
  apiUrl: '',
  alarm: 10,
  expired: 3600,
  showCards: [],
  defaultPath: '/zen',
}

export interface InfoItem {
  module: string
  module_type: string
  [other: string]: any
}

export type InfoList = InfoItem []

export interface BaseModule {
  ca_login?: boolean
  ca_expired_at?: number
  ca_updated_at?: number
}

// 模块 model 基础
export interface BaseModel {
  showCard: boolean
}
