import { defHttp } from '@utils/http/axios'
import configState from '@models/keyValue/configState'
import moduleState from '@models/keyValue/moduleState'
class Bilibili {
  private module = 'bilibili'

  /**
   * 登录检测
   */
  async loginCheck() {
    const { site } = await configState.getItem(this.module)

    const res = await browser.cookies.get({ url: site, name: 'SESSDATA' })
    if (res)
      return res.value
    else
      return false
  }

  /**
   * 个人信息
   */
  async me() {
    const { apiUrl } = await configState.getItem(this.module)
    try {
      const res = await defHttp.get({
        url: `${apiUrl}/x/web-interface/nav`,
      })

      return res.data.data
    }
    catch (e) {
      return {}
    }
  }

  /**
   * 个人信息 stat
   */
  async meStat() {
    const { apiUrl } = await configState.getItem(this.module)
    try {
      const res = await defHttp.get({
        url: `${apiUrl}/x/web-interface/nav/stat`,
      })

      return res.data.data
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
    const statRes = await this.meStat()
    const cardRes = await this.cardInfo(res)

    if (Object.keys(res).length || Object.keys(statRes).length)
      return await moduleState.mergeSet(this.module, { data: Object.assign(res, statRes, { space: cardRes }) })
    else
      return {}
  }

  /**
   * 直播签到
   */
  async sign() {
    const { liveApiUrl } = await configState.getItem(this.module)
    const today = dayjs().format('YYYY-MM-DD')
    const returnRes = { date: today, success: true }

    try {
      const res = await defHttp.get({
        url: `${liveApiUrl}/xlive/web-ucenter/v1/sign/DoSign`,
      })

      if (res.data.code === 1011040) {
        await moduleState.mergeSet(this.module, { data: { sign: returnRes } })
        return returnRes
      }
    }
    catch (e) {}

    returnRes.success = false
    return returnRes
  }

  /**
   * 获取卡片信息，主要是头图
   * @param moduleInfo - 模块信息
   */
  async cardInfo(moduleInfo: any) {
    const { apiUrl } = await configState.getItem(this.module)
    try {
      const res = await defHttp.get({
        url: `${apiUrl}/x/web-interface/card`,
        params: {
          photo: true,
          mid: moduleInfo.mid,
        },
      })

      return res.data.data.space
    }
    catch (e) {
      return {}
    }
  }
}

export default new Bilibili()
