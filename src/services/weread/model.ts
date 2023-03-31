type Config = Module.BaseConfig & {
  apiUrl_2: string
  shelfUrl: string
}

type ConfigShow = Pick<
  Config,
  'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm'
>

const config: Config = {
  key: 'weread',
  name: '微信读书',
  enable: false,

  board_menu: [],

  cron: [],

  alarm: 60,
  expired: 3600,

  site: 'https://weread.qq.com',
  apiUrl: 'https://weread.qq.com/web',
  apiUrl_2: 'https://i.weread.qq.com',
  shelfUrl: 'https://weread.qq.com/web/shelf',
  showCard: false,
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
