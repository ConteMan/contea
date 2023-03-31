type Config = Module.BaseConfig & {
}

type ConfigShow = Pick<
  Config,
  'key' | 'name' | 'enable' | 'expired' | 'alarm'
>

const config: Config = {
  key: 'wakatime',
  name: 'WakaTime',
  enable: false,

  board_menu: [],

  cron: [],

  alarm: 60,
  expired: 600,

  site: 'https://wakatime.com',
  apiUrl: 'https://wakatime.com/api/v1',
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
