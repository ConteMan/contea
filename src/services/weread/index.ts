import type { User } from './model'
import configState from '~/models/keyValue/configState'
import { defHttp } from '~/utils/http/axios'
import moduleState from '~/models/keyValue/moduleState'

class WeRead {
  private moduleName = 'weread'

  /**
   * 获取用户ID
   */
  async getUserId() {
    const { site: url } = await configState.getItem(this.moduleName)
    const res = await browser.cookies.get({ url, name: 'wr_vid' })
    await defHttp.get({ url })
    return res?.value
  }

  /**
   * 获取用户信息
   */
  async user() {
    const { apiUrl } = await configState.getItem(this.moduleName)

    const userVid = await this.getUserId()
    if (!userVid)
      return {}

    const res = await defHttp.get({
      url: `${apiUrl}/user`,
      params: {
        userVid,
      },
    })

    return res.data as User
  }

  /**
   * 获取无限卡信息
   */
  async memberCard() {
    const { apiUrl } = await configState.getItem(this.moduleName)

    const userVid = await this.getUserId()

    if (!userVid)
      return {}

    const res = await defHttp.get({
      url: `${apiUrl}/pay/memberCardSummary`,
      params: {
        pf: 'ios',
      },
    })
    return res.data
  }

  /**
   * 获取阅读详情
   * @param type number - 类型
   * @param count number - 请求数量
   */
  async readDetail(type: 0 | 1 = 0, count = 1) {
    const { apiUrl_2 } = await configState.getItem(this.moduleName)

    const userVid = await this.getUserId()

    if (!userVid)
      return {}

    const res = await defHttp.get({
      url: `${apiUrl_2}/readdetail`,
      params: {
        type,
        count,
      },
    })
    return res.data
  }

  /**
   * 获取整体信息
   * @param force boolean - 是否强制更新
   */
  async moduleInfo(force = false) {
    const { key, expried } = await configState.getItem(this.moduleName)
    const now = new Date().getTime()

    if (!force) {
      const cacheData = await moduleState.getItem(key)
      if (cacheData?.expried && cacheData?.expried > now)
        return cacheData
    }

    if (!this.getUserId)
      return {}

    const newData = {} as any
    newData.user = await this.user()
    newData.memberCard = await this.memberCard()
    newData.readDetail = await this.readDetail()
    newData.expried = now + expried * 1000

    await moduleState.setItem(key, newData)

    return newData
  }
}

export default new WeRead()
