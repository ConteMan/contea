import { setting as base } from '@services/base/model'
import { setting as v2ex } from '@services/v2ex/model'
import { setting as sspai } from '@services/sspai/model'
import { setting as weread } from '@services/weread/model'
import { setting as bgm } from '@services/bgm/model'
import { setting as github } from '@services/github/model'
import { setting as jike } from '@services/jike/model'
import { setting as juejin } from '@services/juejin/model'
import { setting as one } from '@services/one/model'
import { setting as wakatime } from '@services/wakatime/model'
import { setting as weather } from '@services/weather/model'
import { setting as zhihu } from '@services/zhihu/model'
import { setting as movie } from '@services/movie/model'
import { setting as bilibili } from '@services/bilibili/model'
import { setting as wallpaper } from '@services/wallpaper/model'
import { setting as sport } from '@services/sport/model'
import { setting as yuque } from '@services/yuque/model'
import { setting as sync } from '@services/sync/model'

export const modules = ['v2ex', 'sspai', 'weread', 'github', 'juejin', 'one', 'wakatime', 'jike', 'bgm', 'weather', 'zhihu', 'movie', 'bilibili', 'sport', 'wallpaper', 'yuque', 'sync']

export interface Setting {
  base: typeof base
  v2ex: typeof v2ex
  sspai: typeof sspai
  weread: typeof weread
  bgm: typeof bgm
  github: typeof github
  jike: typeof jike
  juejin: typeof juejin
  one: typeof one
  wakatime: typeof wakatime
  weather: typeof weather
  zhihu: typeof zhihu
  movie: typeof movie
  bilibili: typeof bilibili
  wallpaper: typeof wallpaper
  sport: typeof sport
  yuque: typeof yuque
  sync: typeof sync
}

export type SettingKeys = keyof Setting

export default {
  base,
  v2ex,
  sspai,
  weread,
  bgm,
  github,
  jike,
  juejin,
  one,
  wakatime,
  weather,
  zhihu,
  movie,
  bilibili,
  wallpaper,
  sport,
  yuque,
  sync,
}
