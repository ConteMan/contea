type Config = Module.BaseConfig & {
  enableTypes: string[]
}

type ConfigShow = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm'>

const config: Config = {
  key: 'juejin',
  name: '掘金',
  enable: false,

  board_menu: [],

  cron: [],

  alarm: 60,
  expired: 3600,

  site: 'https://juejin.cn',
  apiUrl: 'https://api.juejin.cn',
  enableTypes: [],
  contentScript: {
    enable: true,
    alarm: 10,
    url: 'https://juejin.cn',
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
