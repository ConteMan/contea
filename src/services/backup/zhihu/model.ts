type Config = Module.BaseConfig & {
}

type ConfigShow = Pick<
  Config,
  'key' | 'name' | 'enable' | 'expired' | 'alarm'
>

const config: Config = {
  key: 'zhihu',
  name: '知乎',
  enable: false,

  board_menu: [],

  cron: [],

  alarm: 60,
  expired: 600,

  site: 'https://www.zhihu.com',
  apiUrl: 'https://www.zhihu.com',
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
