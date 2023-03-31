type Config = Module.BaseConfig & {
  token: string // AccessToken
  gistUrl: string
}

type ConfigShow = Pick<
  Config,
  'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'token' | 'expired' | 'alarm'
>

const config: Config = {
  key: 'github',
  name: 'GitHub',
  enable: false,

  board_menu: [],

  cron: [],

  alarm: 60,

  site: 'https://github.com',
  apiUrl: 'https://api.github.com',
  gistUrl: 'https://gist.github.com',
  token: '',
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
