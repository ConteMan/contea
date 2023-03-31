type Config = Module.BaseConfig & {
  module: {
    huya: {
      site: string
    }
  }
}

type ConfigShow = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm'>

const config: Config = {
  key: 'live',
  name: '直播',
  enable: false,

  board_menu: [],

  cron: [],

  alarm: 60,
  expired: 3600,

  site: '',
  apiUrl: '',
  showCard: false,
  module: {
    huya: {
      site: 'https://www.libvio.com',
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
