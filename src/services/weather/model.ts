import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expried' | 'alarm' | 'showCard'>

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
