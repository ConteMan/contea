import type { BaseConfig } from '@services/base/model'

export type Config = BaseConfig & {
  remoteUrl?: string
  remotePort?: string
}

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'remoteUrl' | 'remotePort'>

export const setting: Config = {
  key: 'sync',
  name: '同步',
  enable: false,

  site: '',
}
