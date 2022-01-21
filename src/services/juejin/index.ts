import { defHttp } from '~/utils/http/axios'
import RequestCache from '~/services/base/requestCache'
import ConfigState from '~/models/keyValue/configState'
import ModuleState from '~/models/keyValue/moduleState'

class Juejin {
  private module = 'juejin'

  /**
   * 获取 SessionId
   */
  async getSessionId() {
    const { site } = await ConfigState.getItem(this.module)
    try {
      const res = await browser.cookies.get({ url: site, name: 'sessionid' })
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
  async loginCheck(): Promise<boolean> {
    return Boolean(await this.getSessionId())
  }

  /**
   * 通过接口获取个人信息
   */
  async me() {
    const cacheKey = [this.module, 'me']
    const cacheData = await RequestCache.get(cacheKey)
    if (cacheData)
      return cacheData

    if (!await this.loginCheck())
      return false

    const { apiUrl } = await ConfigState.getItem(this.module)
    try {
      const res = await defHttp.get({
        url: `${apiUrl}/user_api/v1/user/get`,
      })

      if (res.data.err_no)
        return false

      const data = res.data.data

      if (res)
        await RequestCache.set(cacheKey, data)

      return data
    }
    catch (e) {
      return false
    }
  }

  /**
   * 通过缓存获取个人信息
   */
  async user() {
    const cache = await ModuleState.getValidItem(this.module)
    if (cache)
      return cache

    const meRes = await this.me()

    const now = new Date().getTime()
    const { expried } = await ConfigState.getItem(this.module)
    const moduleData = {
      ...meRes,
      expried: now + expried * 1000,
    }

    await ModuleState.mergeSet(this.module, moduleData)

    return moduleData
  }
}

export default new Juejin()
