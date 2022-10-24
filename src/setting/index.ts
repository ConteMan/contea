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

// import { setting as v2ex } from '@services/v2ex/model'
// import { setting as bgm } from '@services/bgm/model'
// import { setting as jike } from '@services/jike/model'
// import { setting as juejin } from '@services/juejin/model'
// import { setting as wakatime } from '@services/wakatime/model'
// import { setting as zhihu } from '@services/zhihu/model'
// import { setting as wallpaper } from '@services/wallpaper/model'
// import { setting as yuque } from '@services/yuque/model'
// import { setting as sync } from '@services/sync/model'

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

  // 'v2ex',
  // 'juejin',
  // 'wakatime',
  // 'jike',
  // 'bgm',
  // 'zhihu',
  // 'wallpaper',
  // 'yuque',
  // 'sync',
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

  // v2ex: typeof v2ex
  // bgm: typeof bgm
  // jike: typeof jike
  // juejin: typeof juejin
  // wakatime: typeof wakatime
  // zhihu: typeof zhihu
  // wallpaper: typeof wallpaper
  // yuque: typeof yuque
  // sync: typeof sync
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

  // v2ex,
  // bgm,
  // jike,
  // juejin,
  // wakatime,
  // zhihu,
  // wallpaper,
  // yuque,
  // sync,
}
