import configState from '@models/keyValue/configState'
import RequestCache from '@services/base/requestCache'
import { defHttp } from '@utils/http/axios'
import moduleState from '@models/keyValue/moduleState'
import type { Config, HotParams } from './model'

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
   * 获取个人信息
   */
  async me() {
    const { apiUrl } = await configState.getItem(this.module) as Config
    try {
      const res = await defHttp.get({
        url: `${apiUrl}/api/v4/me?include=ad_type,available_message_types,default_notifications_count,follow_notifications_count,vote_thank_notifications_count,messages_count,email,account_status,is_bind_phone,url_token`,
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
      const res = await defHttp.get({
        url: `${apiUrl}/api/v3/feed/topstory/hot-lists/total?limit=${limit}`,
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
