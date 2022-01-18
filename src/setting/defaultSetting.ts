import { defaultSetting as v2ex } from '~/services/v2ex/model'
import { defaultSetting as sspai } from '~/services/sspai/model'
import { defaultSetting as weread } from '~/services/weread/model'
import { defaultSetting as bgm } from '~/services/bgm/model'
import { defaultSetting as github } from '~/services/github/model'

export default {
  default: {
    storageExpried: 300, // 单位: 秒
    expried: 600,
    hasInit: true,
    modules: [
      'v2ex',
      'sspai',
    ],
    alarm: 10,
  },
  v2ex,
  sspai,
  weread,
  bgm,
  github,
}
