import type { BaseConfig } from '@services/base/model'

export type Config = BaseConfig & {
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm'>

export const setting: Config = {
  key: 'wallpaper',
  name: 'Wallpaper',
  enable: false,
  site: '',
  apiUrl: '',
  expired: 3600,
  alarm: 60,
}

export const alphacodersInfo = {
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

export const bing = {
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

export const SourceTypes = [
  alphacodersInfo,
  bing,
]
