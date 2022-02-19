import type { BaseConfig } from '~/services/base/model'

export type Config = BaseConfig & {
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'expried' | 'alarm'>

export const setting: Config = {
  key: 'sport',
  name: '体育',
  enable: true,
  site: '',
  apiUrl: '',
  expried: 600,
  alarm: 60,
  showCard: false,
}
