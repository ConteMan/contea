type Config = Module.BaseConfig & {
}

type ConfigShow = Pick<
  Config,
  'key' | 'name' | 'enable' | 'expired' | 'alarm'
>

const config: Config = {
  key: 'yuque',
  name: '语雀',
  enable: false,

  board_menu: [],

  cron: [],

  alarm: 60,
  expired: 600,

  site: 'https://www.yuque.com',
  apiUrl: 'https://www.yuque.com/api',
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
