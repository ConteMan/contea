type Config = Module.BaseConfig & {
}

type ConfigShow = Pick<
  Config,
  'key' | 'name' | 'enable' | 'expired' | 'alarm'
>

const config: Config = {
  key: 'sport',
  name: '体育',
  enable: false,

  board_menu: [],

  cron: [],

  alarm: 60,
  expired: 600,

  site: '',
  apiUrl: '',
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
