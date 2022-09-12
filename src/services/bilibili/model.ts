import type { BaseConfig } from '@services/base/model'

export type Config = BaseConfig & {
  tSite: string
  spaceSite: string
  liveApiUrl: string
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm' | 'showCard'>

export const setting: Config = {
  key: 'bilibili',
  name: '哔哩哔哩',
  enable: false,
  site: 'https://www.bilibili.com', // 主站
  tSite: 'https://t.bilibili.com/', // 动态
  spaceSite: 'https://space.bilibili.com', // 空间
  apiUrl: 'https://api.bilibili.com',
  liveApiUrl: 'https://api.live.bilibili.com',
  alarm: 60,
  expired: 3600,
  showCard: false,
  contentScript: {
    enable: true,
    url: 'https://www.bilibili.com',
    alarm: 10,
  },
}

export const configKeys = Object.keys(setting)
