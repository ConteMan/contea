import type { BaseConfig } from '@services/base/model'

export type Config = BaseConfig & {
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'expired' | 'alarm'>

export const setting: Config = {
  key: 'sport',
  name: '体育',
  enable: false,
  site: '',
  apiUrl: '',
  expired: 600,
  alarm: 60,
  showCard: false,
}
