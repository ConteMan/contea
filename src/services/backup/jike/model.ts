type Config = Module.BaseConfig & {
  enableTypes: string[]
}

type ConfigShow = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm'>

const config: Config = {
  key: 'jike',
  name: '即刻',
  enable: false,

  board_menu: [],

  cron: [],

  alarm: 60,
  expired: 3600,

  site: 'https://web.okjike.com',
  apiUrl: 'https://web-api.okjike.com/api/graphql',
  enableTypes: [],
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
