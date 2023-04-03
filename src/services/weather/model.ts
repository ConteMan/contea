type Config = Module.BaseConfig & {
  default_cma_station_id: number
}

type ConfigShow = Pick<
  Config,
  'key' | 'name' | 'enable' | 'expired' | 'alarm' | 'default_cma_station_id'
>

const config: Config = {
  key: 'weather',
  name: '天气',
  enable: true,

  board_menu: [],

  cron: [],

  alarm: 60,
  expired: 3600,
  default_cma_station_id: 59493,

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
