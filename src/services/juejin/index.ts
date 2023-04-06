import type { Config } from '@services/juejin/model'
import type { Config as BaseConfig } from '@services/base/model'
import qs from 'qs'
import { MODULES } from '@config/index'
import { ConfigModel } from '@models/index'
import { createAxios } from '@utils/http/axios'
import { getCookieStr } from '@utils/index'

class Juejin {
  private MODULE = MODULES.JUEJIN

  async getModuleInfo() {
    return await ConfigModel.getItem(this.MODULE) as Config
  }

  /**
   * 获取请求库实例
   * @param baseURL - 请求域名
   */
  async getRequestClient(baseURL = '') {
    if (!baseURL) {
      const { url } = await this.getModuleInfo()
      baseURL = url.api
    }
    return createAxios({
      baseURL,
      transform: {
        transformRequestHook(res) {
          return res.data
        },
      },
    })
  }

  /**
   * 使用代理请求数据
   * @param config - 请求配置
   */
  async getProxyRequestClient(config: Record<string, any>) {
    const { url } = await this.getModuleInfo()
    const { url: baseUrl } = await ConfigModel.getItem(MODULES.BASE) as BaseConfig

    const cookieStr = await getCookieStr(url.api)
    config.url = `${url.api}${config.url}`
    config.headers = { ...config.headers, Cookie: cookieStr }

    const requestClient = await this.getRequestClient(baseUrl.proxy_query)

    return await requestClient.request({
      url: '/query',
      method: 'post',
      data: qs.stringify({ config: JSON.stringify(config) }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  }

  /**
   * 获取 SessionId
   */
  async getSessionId() {
    const { url } = await this.getModuleInfo()
    try {
      const res = await browser.cookies.get({ url: url.site, name: 'sessionid' })
      return res?.value ?? false
    }
    catch (error) {
      return false
    }
  }

  /**
   * 登录检测
   * @returns boolean
   */
  async checkLogin() {
    return Boolean(await this.getSessionId())
  }

  /**
   * 获取个人信息
   */
  async getUser() {
    const requestClient = await this.getRequestClient()
    return await requestClient.get({ url: '/user_api/v1/user/get' })
  }

  /**
   * 获取收藏集
   * @param query - 参数
   */
  async getCollections(query = { cursor: '0', limit: 20 }) {
    const user_id = '2365804752143677'

    const config = {
      url: '/interact_api/v2/collectionset/list',
      method: 'post',
      data: { article_id: '', user_id, ...query },
      headers: {},
    }
    return await this.getProxyRequestClient(config)
  }

  /**
   * 获取收藏集详情
   * @param query - 参数
   */
  async getCollectionDetail(query = { collection_id: '', cursor: '0', limit: 10 }) {
    query.collection_id = '6845243991999381518'

    const config = {
      url: '/interact_api/v2/collectionset/detail',
      method: 'post',
      data: query,
      headers: {},
    }
    return await this.getProxyRequestClient(config)
  }
}

export default new Juejin()
