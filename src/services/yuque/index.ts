import type { Config, RecommendParams } from './model'

import { defHttp } from '~/utils/http/axios'

import configState from '~/models/keyValue/configState'
import moduleState from '~/models/keyValue/moduleState'
import RequestCache from '~/services/base/requestCache'

class Yuque {
  private module = 'yuque'

  /**
   * 登录检测
   */
  async loginCheck(): Promise<boolean> {
    const { site } = await configState.getItem(this.module) as Config

    try {
      const dashboardUrl = `${site}/dashboard`
      const res = await defHttp.get({ url: dashboardUrl })

      // 如果跳转到非指定页面则认为未登录
      return res.request.responseURL === dashboardUrl
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取个人信息
   */
  async me() {
    const { apiUrl } = await configState.getItem(this.module) as Config
    try {
      const res = await defHttp.get({
        url: `${apiUrl}/mine`,
      })
      return res.data
    }
    catch (e) {
      return {}
    }
  }

  /**
   * 通过缓存获取模块信息
   */
  async moduleInfo(refresh = false) {
    if (!refresh) {
      const cache = await moduleState.getValidItem(this.module)
      if (cache)
        return cache
    }

    const res = await this.me()

    if (Object.keys(res).length)
      return await moduleState.mergeSet(this.module, { data: res })
    else
      return {}
  }

  /**
   * 获取推荐
   * @param Params - 请求参数
   * @param refresh - 是否刷新
   */
  async recommend(Params: RecommendParams = { limit: 20, page: 1 }, refresh = false): Promise<any> {
    const type = 'recommend'
    const cacheKey = [this.module, type]

    if (!refresh) {
      const cacheData = await RequestCache.get(cacheKey)
      if (cacheData)
        return cacheData
    }

    const { limit, page } = Params
    const { apiUrl } = await configState.getItem(this.module) as Config
    try {
      const res = await defHttp.get({
        url: `${apiUrl}/explore/recommends`,
        params: {
          limit,
          page,
          type: 'Doc',
        },
      })

      if (res.data.data)
        return await RequestCache.set(cacheKey, { data: res.data.data })

      return {}
    }
    catch (e) {
      return {}
    }
  }
}

export default new Yuque()
