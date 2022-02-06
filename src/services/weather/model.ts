import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
}

export const setting: Config = {
  key: 'weather',
  name: 'Weather',
  enable: true,
  site: 'https://weather.cma.cn',
  apiUrl: 'https://weather.cma.cn/api',
  expried: 3600,
  alarm: 60,
  showCard: true,
}
