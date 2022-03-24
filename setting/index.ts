import { setting as base } from '@services/base/model'
import { setting as v2ex } from '@services/v2ex/model'

export const modules = ['v2ex', 'sspai', 'weread', 'github', 'juejin', 'one', 'wakatime', 'jike', 'bgm', 'weather', 'zhihu', 'movie', 'bilibili', 'sport', 'wallpaper', 'yuque']

export interface Setting {
  base: typeof base
  v2ex: typeof v2ex

}

export type SettingKeys = keyof Setting

export default {
  base,
  v2ex,
}
