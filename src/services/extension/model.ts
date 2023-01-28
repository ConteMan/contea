import type { BaseConfig } from '@services/base/model'
import { MODULES } from '@enums/index'

export type Config = BaseConfig

export type ShowConfig = Pick<Config, 'key' | 'name' | 'enable'>

export const setting: Config = {
  key: MODULES.EXTENSION,
  name: '扩展',
  enable: true,
}

export const configKeys = Object.keys(setting)
