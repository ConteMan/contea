import { defHttp } from '@utils/http/axios'
import Cookie from '@services/browser/cookie'

class Hub {
  private API_URL = 'http://127.0.0.1:7002'

  /**
   * 获取同步列表
   */
  async getCookieSyncList() {
    try {
      const res = await defHttp.get({
        url: `${this.API_URL}/cookies/syncList`,
      })
      if (res.data.data)
        return res.data.data

      return []
    }
    catch (e) {
      return []
    }
  }

  /**
   * 获取同步列表，保存 Cookie
   */
  async saveCookie() {
    try {
      const list = await this.getCookieSyncList()
      if (list.length) {
        for await (const item of list) {
          const urlCookies = await Cookie.getAll({ url: item.url })
          await defHttp.post({
            url: `${this.API_URL}/cookies/save`,
            data: {
              id: item.id,
              data: urlCookies,
            },
          })
        }
      }
      return true
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log('>>> service >> hub > saveCookie error', e)

      return false
    }
  }
}

export default new Hub()
