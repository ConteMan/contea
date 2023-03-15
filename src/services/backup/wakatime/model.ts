import type { BaseConfig } from '@services/base/model'

export type Config = BaseConfig & {
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm' | 'showCard'>

export const setting: Config = {
  key: 'wakatime',
  name: 'WakaTime',
  enable: false,
  site: 'https://wakatime.com',
  apiUrl: 'https://wakatime.com/api/v1',
  expired: 600,
  alarm: 60,
  showCard: true,
}
