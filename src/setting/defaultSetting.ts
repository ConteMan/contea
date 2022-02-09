import { setting as github } from '~/services/github/model'
import { setting as bgm } from '~/services/bgm/model'
import { setting as jike } from '~/services/jike/model'
import { setting as juejin } from '~/services/juejin/model'
import { setting as one } from '~/services/one/model'
import { setting as sspai } from '~/services/sspai/model'
import { setting as v2ex } from '~/services/v2ex/model'
import { setting as wakatime } from '~/services/wakatime/model'
import { setting as weather } from '~/services/weather/model'
import { setting as weread } from '~/services/weread/model'
import { setting as zhihu } from '~/services/zhihu/model'
import { setting as movie } from '~/services/movie/model'
import { setting as bilibili } from '~/services/bilibili/model'

export const modules = ['v2ex', 'sspai', 'weread', 'github', 'juejin', 'one', 'wakatime', 'jike', 'bgm', 'weather', 'zhihu', 'movie', 'bilibili']

export default {
  default: {
    enable: true,
    modules,
    expried: 600,
    alarm: 10,
  },
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
}
