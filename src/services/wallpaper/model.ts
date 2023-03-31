type Config = Module.BaseConfig & {
}

type ConfigShow = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm'>

const config: Config = {
  key: 'wallpaper',
  name: '壁纸',
  enable: false,

  board_menu: [],

  cron: [],

  alarm: 60,
  expired: 3600,

  site: '',
  apiUrl: '',
}

const configKeys = Object.keys(config)

const alphacodersInfo = {
  name: 'Alphacoders Wallpaper',
  key: 'alphacoders',
  category: [
    {
      name: 'Anime',
      key: 'alphacoders-anime',
      url: '/by_category.php?id=3&name=Anime+Wallpapers',
    },
    {
      name: 'Popular',
      key: 'alphacoders-popular',
      url: '/popular.php',
    },
  ],
}

const bing = {
  name: 'Bing',
  key: 'bing',
  category: [
    {
      name: '七日壁纸',
      key: 'bing-week',
      url: 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=7&uhd=1&uhdwidth=2560&uhdheight=1440',
    },
  ],
}

const SourceTypes = [
  alphacodersInfo,
  bing,
]

export type {
  Config,
  ConfigShow,
}

export {
  config,
  configKeys,

  alphacodersInfo,
  bing,
  SourceTypes,
}
