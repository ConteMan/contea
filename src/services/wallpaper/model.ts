import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm'>

export const setting: Config = {
  key: 'wallpaper',
  name: 'Wallpaper',
  enable: true,
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

export const SourceTypes = [
  alphacodersInfo,
]
