import { config as base } from '@services/base/model'
import { config as bilibili } from '@services/bilibili/model'
import { config as github } from '@services/github/model'
import { config as sspai } from '@services/sspai/model'
import { config as movie } from '@services/movie/model'
import { config as one } from '@services/one/model'
import { config as weread } from '@services/weread/model'
import { config as sport } from '@services/sport/model'
import { config as weather } from '@services/weather/model'

/**
 * 模块 MAP
 */
const MODULE_DEFAULT_MAP = {
  base,
  bilibili,
  github,
  sspai,
  movie,
  one,
  weread,
  sport,
  weather,
}

/**
 * 模块数组
 */
const MODULE_DEFAULT_ARRAY = Object.values(MODULE_DEFAULT_MAP)

type ModuleKey = keyof typeof MODULE_DEFAULT_MAP

/**
 * 模块 KEY 数组
 */
const MODULE_DEFAULT_KEYS = Object.keys(MODULE_DEFAULT_MAP) as ModuleKey[]

/**
 * 模块 ENUM
*/
type ModuleType = { [Key in ModuleKey as Uppercase<Key>]: Key }

const MODULES = {} as ModuleType

MODULE_DEFAULT_KEYS.forEach((item: ModuleKey) => {
  MODULES[item.toUpperCase() as (keyof ModuleType)] = item as never
})

export {
  MODULE_DEFAULT_MAP,
  MODULE_DEFAULT_ARRAY,
  MODULE_DEFAULT_KEYS,
  MODULES,
}
export type {
  ModuleKey,
}
