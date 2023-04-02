type Config = Module.BaseConfig & {
  url: string
  cdnUrl?: string
  enableTypes: any[]
}

type ConfigShow = Pick<
  Config,
  'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm' | 'enableTypes'
>

const config: Config = {
  key: 'sspai',
  name: '少数派',
  enable: false,

  board_menu: [
    {
      key: 'sspai',
      name: '少数派',
      enable: false,
      sort: 0,
    },
  ],

  cron: [],

  alarm: 30,
  expired: 3600,

  site: 'https://sspai.com',
  url: 'https://sspai.com',
  apiUrl: 'https://sspai.com/api/v1',
  cdnUrl: 'https://cdn.sspai.com',
  enableTypes: [
    'index',
    // 'followActivity',
    // 'matrix',
  ],
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
