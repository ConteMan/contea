import type { BaseConfig } from '~/services/base/model'

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
  enable: true,
  site: '',
  apiUrl: '',
  alarm: 60,
  expired: 3600,
  showCard: false,
  module: {
    libvio: {
      site: 'https://www.libvio.com',
    },
    ddrk: {
      site: 'https://ddrk.com',
    },
  },
}

export interface Item {
  title?: string
  [other: string]: any
}

export type List = Item []
