import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
}

export const setting: Config = {
  key: 'wakatime',
  name: 'WakaTime',
  enable: true,
  site: 'https://wakatime.com',
  apiUrl: 'https://wakatime.com/api/v1',
  expried: 600,
  alarm: 60,
  showCard: true,
}
