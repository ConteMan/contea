import { defaultSetting as v2ex } from '~/services/v2ex/model'
import { defaultSetting as sspai } from '~/services/sspai/model'
import { defaultSetting as weread } from '~/services/weread/model'
import { defaultSetting as bgm } from '~/services/bgm/model'
import { defaultSetting as github } from '~/services/github/model'
import { defaultSetting as jike } from '~/services/jike/model'
import { defaultSetting as juejin } from '~/services/juejin/model'
import { defaultSetting as one } from '~/services/one/model'
import { defaultSetting as wakatime } from '~/services/wakatime/model'
import { defaultSetting as weather } from '~/services/weather/model'

export const modules = ['v2ex', 'sspai', 'weread', 'github', 'juejin', 'one', 'wakatime', 'jike', 'bgm', 'weather']

export default {
  default: {
    storageExpried: 300, // 单位: 秒
    expried: 600,
    hasInit: true,
    modules,
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
}
