import type { BaseConfig } from '@services/base/model'

export type Config = BaseConfig & {
  module: {
    huya: {
      site: string
    }
  }
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm'>

export const setting: Config = {
  key: 'live',
  name: '直播',
  enable: true,
  site: '',
  apiUrl: '',
  alarm: 60,
  expired: 3600,
  showCard: false,
  module: {
    huya: {
      site: 'https://www.libvio.com',
    },
  },
}

export interface Item {
  title?: string
  [other: string]: any
}

export type List = Item []
