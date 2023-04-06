type Config = Module.BaseConfig & {
  url: {
    site: string
    api: string
  }
  enableTypes: string[]
}

type ConfigShow = Pick<Config, 'key' | 'name' | 'enable' | 'alarm'>

const config: Config = {
  key: 'juejin',
  name: '掘金',
  enable: false,

  board_menu: [],

  cron: [],

  alarm: 60,
  expired: 3600,

  url: {
    site: 'https://juejin.cn',
    api: 'https://api.juejin.cn',
  },

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
