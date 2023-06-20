import { defHttp } from '@utils/http/axios'
import Cookie from '@services/browser/cookie'
import { ConfigModel, LogModel } from '@models/index'
import { LOG_TYPES } from '@enums/index'

class Hub {
  private API_URL = ''
  private TOKEN = ''

  /**
   * 获取 Hub 地址
   */
  async getHubUrl() {
    const { hubUrl = '', hubToken = '' } = await ConfigModel.getItem('base')
    if (!hubUrl || !hubToken)
      return {}

    this.API_URL = hubUrl
    this.TOKEN = hubToken
    return { hubUrl, hubToken }
  }

  /**
   * 获取同步列表
   */
  async getCookieSyncList() {
    try {
      await this.getHubUrl()
      if (!this.API_URL || !this.TOKEN)
        return []

      const res = await defHttp.get({
        url: `${this.API_URL}/cookies/syncList`,
        headers: {
          Authorization: `Bearer ${this.TOKEN}`,
        },
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
    await LogModel.record(LOG_TYPES.TO_HUB, { method: 'saveCookie' })

    try {
      const list = await this.getCookieSyncList()
      if (list.length) {
        for await (const item of list) {
          const urlCookies = await Cookie.getAll({ url: item.url })
          await defHttp.post({
            url: `${this.API_URL}/cookies/save`,
            headers: {
              Authorization: `Bearer ${this.TOKEN}`,
            },
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
