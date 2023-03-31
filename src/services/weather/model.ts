type Config = Module.BaseConfig & {
}

type ConfigShow = Pick<
  Config,
  'key' | 'name' | 'enable' | 'expired' | 'alarm'
>

const config: Config = {
  key: 'weather',
  name: '天气',
  enable: true,

  board_menu: [],

  cron: [],

  alarm: 60,
  expired: 600,

  site: 'https://weather.cma.cn',
  apiUrl: 'https://weather.cma.cn/api',
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
