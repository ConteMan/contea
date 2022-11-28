import type { BaseConfig } from '@services/base/model'

export type Config = BaseConfig

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable' | 'worldlineEnable'>

export const setting: Config = {
  key: 'bookmark',
  name: '书签',
  enable: true,
  worldlineEnable: true,
}

export const configKeys = Object.keys(setting)
