export type InfoItem = {
  module: string
  module_type: string
  [other: string]: any
}

export type InfoList = InfoItem []

export type BaseConfig = {
  key: string
  name: string // 模块名称
  enable: boolean // 是否启用
  site: string // 站点 URL
  apiUrl: string // API URL
  showCard: boolean // 是否显示卡片
  expried: number // 缓存时间，单位：秒
  alarm?: number // 定时任务时间，单位：分钟
  [other: string]: any
}

export type BaseModule = {
  ca_login?: boolean
  ca_expried_at?: number
  ca_updated_at?: number
}

// 模块 model 基础
export type BaseModel = {
  showCard: boolean
}
