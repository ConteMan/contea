import { MODULES } from '@enums/index'

import { setting as base } from '@services/base/model'
import { setting as sspai } from '@services/sspai/model'
import { setting as movie } from '@services/movie/model'
import { setting as bilibili } from '@services/bilibili/model'
import { setting as one } from '@services/one/model'
import { setting as weread } from '@services/weread/model'
import { setting as sport } from '@services/sport/model'
import { setting as weather } from '@services/weather/model'
import { setting as github } from '@services/github/model'

export const modules = [
  MODULES.BASE,
  MODULES.SSPAI,
  MODULES.MOVIE,
  MODULES.BILIBILI,
  MODULES.ONE,
  MODULES.WEREAD,
  MODULES.SPORT,
  MODULES.WEATHER,
  MODULES.GITHUB,
]

export interface Setting {
  base: typeof base
  sspai: typeof sspai
  movie: typeof movie
  bilibili: typeof bilibili
  one: typeof one
  weread: typeof weread
  sport: typeof sport
  weather: typeof weather
  github: typeof github
}

export type SettingKeys = keyof Setting

// #2 默认初始配置
export default {
  base,
  sspai,
  movie,
  bilibili,
  one,
  weread,
  sport,
  weather,
  github,
}
