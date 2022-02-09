import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
  tSite: string
  spaceSite: string
  liveApiUrl: string
}

export const setting: Config = {
  key: 'bilibili',
  name: '哔哩哔哩',
  enable: true,
  site: 'https://www.bilibili.com', // 主站
  tSite: 'https://t.bilibili.com/', // 动态
  spaceSite: 'https://space.bilibili.com', // 空间
  apiUrl: 'https://api.bilibili.com',
  liveApiUrl: 'https://api.live.bilibili.com',
  alarm: 60,
  expried: 3600,
  showCard: true,
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expried' | 'alarm' | 'showCard'>
