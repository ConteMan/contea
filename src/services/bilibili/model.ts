type Config = Module.BaseConfig & {
  tSite: string
  spaceSite: string
  liveApiUrl: string
}

type ConfigShow = Pick<
  Config,
  'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm' | 'showCard'
>

const config: Config = {
  key: 'bilibili',
  name: '哔哩哔哩',
  enable: false,

  board_menu: [
    {
      key: 'bilibili',
      name: 'Bilibili',
      enable: false,
      sort: 0,
    },
  ],

  cron: [],

  alarm: 60,
  expired: 3600,

  site: 'https://www.bilibili.com', // 主站
  tSite: 'https://t.bilibili.com', // 动态
  spaceSite: 'https://space.bilibili.com', // 空间
  apiUrl: 'https://api.bilibili.com',
  liveApiUrl: 'https://api.live.bilibili.com',

  contentScript: {
    enable: true,
    url: 'https://www.bilibili.com',
    alarm: 10,
  },
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
