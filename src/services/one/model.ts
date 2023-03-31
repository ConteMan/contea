type Config = Module.BaseConfig & {
  token?: string // AccessToken
  enableTypes: string[]
}

type ConfigShow = Pick<
  Config,
  'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm'
>

const config: Config = {
  key: 'one',
  name: '一个',
  enable: false,

  board_menu: [],

  cron: [],

  alarm: 60,
  expired: 86400,

  site: 'http://wufazhuce.com',
  apiUrl: '',
  token: '',
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
