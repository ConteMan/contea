import { setting as base } from '@services/base/model'
import { setting as sspai } from '@services/sspai/model'
import { setting as movie } from '@services/movie/model'
import { setting as bilibili } from '@services/bilibili/model'
import { setting as one } from '@services/one/model'
import { setting as weread } from '@services/weread/model'

// import { setting as v2ex } from '@services/v2ex/model'
// import { setting as bgm } from '@services/bgm/model'
// import { setting as github } from '@services/github/model'
// import { setting as jike } from '@services/jike/model'
// import { setting as juejin } from '@services/juejin/model'
// import { setting as wakatime } from '@services/wakatime/model'
// import { setting as weather } from '@services/weather/model'
// import { setting as zhihu } from '@services/zhihu/model'
// import { setting as wallpaper } from '@services/wallpaper/model'
// import { setting as sport } from '@services/sport/model'
// import { setting as yuque } from '@services/yuque/model'
// import { setting as sync } from '@services/sync/model'

export const modules = [
  'base',
  'sspai',
  'movie',
  'bilibili',
  'one',
  'weread',

  // 'v2ex',
  // 'github',
  // 'juejin',
  // 'wakatime',
  // 'jike',
  // 'bgm',
  // 'weather',
  // 'zhihu',
  // 'sport',
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

  // v2ex: typeof v2ex
  // bgm: typeof bgm
  // github: typeof github
  // jike: typeof jike
  // juejin: typeof juejin
  // wakatime: typeof wakatime
  // weather: typeof weather
  // zhihu: typeof zhihu
  // wallpaper: typeof wallpaper
  // sport: typeof sport
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

  // v2ex,
  // bgm,
  // github,
  // jike,
  // juejin,
  // wakatime,
  // weather,
  // zhihu,
  // wallpaper,
  // sport,
  // yuque,
  // sync,
}
