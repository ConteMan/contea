export interface BaseConfig {
  key: string
  name: string // 模块名称
  enable: boolean // 是否启用

  site: string // 站点 URL
  apiUrl?: string // API URL
  expired?: number // 缓存时间，单位：秒
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
  themeMode: boolean // true => system, false => manual

  // 世界线
  statusList: boolean // 任务
  testPage: boolean // 测试
  dashboardPage?: boolean // 面板页面

  // 桌面端
  enableDesktop: boolean // 是否启用与桌面端的通讯
  desktopInterface: string // 桌面端接口地址
  desktopInterfaceStatus: boolean // 桌面端接口状态，true 连通，false 未连通
}

export type ShowConfig = Pick<
  Config,
  'key' | 'name' | 'enable' | 'expired'
  | 'alarm' | 'statusList' | 'themeMode' | 'enableDesktop'
  | 'desktopInterface' | 'desktopInterfaceStatus' | 'testPage'
  | 'dashboardPage'
  >

export const setting: Config = {
  key: 'base',
  name: '基础',
  enable: true,
  site: '',
  apiUrl: '',
  alarm: 10,
  expired: 3600,
  showCards: [],
  defaultPath: '/index',
  themeMode: true,

  statusList: false,
  testPage: false,
  dashboardPage: true,

  enableDesktop: false,
  desktopInterface: 'http://127.0.0.1:7788/extension',
  desktopInterfaceStatus: false,
}

export const configKeys = Object.keys(setting)

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
