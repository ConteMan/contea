type Config = Module.BaseConfig & {
  url: string
  token?: string
  enableTypes?: V2EX.types[]
}

type ConfigShow = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'token' | 'expired' | 'alarm' | 'enableTypes'>

const config: Config = {
  key: 'v2ex',
  name: 'V2EX',
  enable: false,

  board_menu: [],

  cron: [],

  alarm: 30,
  expired: 3600,

  site: 'https://www.v2ex.com',
  url: 'https://www.v2ex.com',
  apiUrl: '',
  token: '',
  enableTypes: [
    'all',
    'members',
    'hot',
    'tech',
  ],
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
