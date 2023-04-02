type Config = Module.BaseConfig & {
  module: {
    libvio: {
      site: string
    }
    ddrk: {
      site: string
    }
  }
}

type ConfigShow = Pick<
  Config,
  'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm'
>

const config: Config = {
  key: 'movie',
  name: '影视',
  enable: false,

  board_menu: [
    {
      key: 'movie',
      name: '影视',
      enable: false,
      sort: 0,
    },
  ],

  cron: [],

  alarm: 60,
  expired: 3600,

  site: '',
  apiUrl: '',
  module: {
    libvio: {
      site: 'https://www.libvio.me',
    },
    ddrk: {
      site: 'https://ddys.tv',
    },
  },
}

const configKeys = Object.keys(config)

export type {
  Config,
  ConfigShow,
}

export {
  config,
  configKeys,
}
