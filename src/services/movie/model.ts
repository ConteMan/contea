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

export const setting: Config = {
  key: 'movie',
  name: '影视',
  enable: true,
  site: '',
  apiUrl: '',
  alarm: 60,
  expried: 3600,
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

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expried' | 'alarm' | 'showCard'>

export type Item = {
  title?: string
  [other: string]: any
}

export type List = Item []
