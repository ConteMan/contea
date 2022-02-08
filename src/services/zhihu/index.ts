import type { Config, HotParams } from './model'

import { defHttp } from '~/utils/http/axios'
import configState from '~/models/keyValue/configState'
import RequestCache from '~/services/base/requestCache'

class Zhihu {
  private module = 'zhihu'

  /**
   * 登录检测
   * @returns {Promise<boolean>} 是否登录
   */
  async loginCheck(): Promise<boolean> {
    const { site } = await configState.getItem(this.module) as Config

    try {
      const hotUrl = `${site}/hot`
      const res = await defHttp.get({ url: hotUrl })

      // 如果跳转到非指定页面则认为未登录
      return res.request.responseURL === hotUrl
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取热榜
   * @param Params - 热榜请求参数
   * @param refresh - 是否刷新
   * @returns {Promise<{}>} - 数组
   */
  async hot(Params: HotParams = { limit: 50 }, refresh = false): Promise<any> {
    const type = 'hot'
    const cacheKey = [this.module, type]

    if (!refresh) {
      const cacheData = await RequestCache.get(cacheKey)
      if (cacheData)
        return cacheData
    }

    const { limit } = Params
    const { apiUrl } = await configState.getItem(this.module) as Config
    try {
      const hotUrl = `${apiUrl}/api/v3/feed/topstory/hot-lists/total?limit=${limit}`
      const res = await defHttp.get({
        url: hotUrl,
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

export default new Zhihu()
