import type { BaseConfig } from '@services/base/model'

export type Config = BaseConfig & {
  module: {
    libvio: {
      site: string
    }
    ddrk: {
      site: string
    }
  }
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm'>

export const setting: Config = {
  key: 'movie',
  name: '影视',
  enable: false,
  site: '',
  apiUrl: '',
  alarm: 60,
  expired: 3600,
  showCard: false,
  module: {
    libvio: {
      site: 'https://www.libvio.me',
    },
    ddrk: {
      site: 'https://ddys.tv',
    },
  },
}

export const configKeys = Object.keys(setting)

export interface Item {
  title?: string
  [other: string]: any
}

export type List = Item []

export type MovieModules = 'libvio' | 'ddrk'
