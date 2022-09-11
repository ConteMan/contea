import { defHttp } from '@utils/http/axios'
import ConfigModel from '@models/config'
class Bilibili {
  private module = 'bilibili'
  private MODULE_INFO_KEY = 'bilibili_module_info'

  /**
   * 登录检测
   */
  async loginCheck() {
    const { site } = await ConfigModel.getItem(this.module)

    const res = await browser.cookies.get({ url: site, name: 'SESSDATA' })
    if (res)
      return res.value
    else
      return false
  }

  /**
   * 个人信息
   */
  async getProfile() {
    const { apiUrl } = await ConfigModel.getItem(this.module)
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
  async getStat() {
    const { apiUrl } = await ConfigModel.getItem(this.module)
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
   * 获取卡片信息，主要是头图
   * @param moduleInfo - 模块信息
   */
  async getCard(moduleInfo: any) {
    const { apiUrl } = await ConfigModel.getItem(this.module)
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

  /**
   * 通过缓存获取模块信息
   */
  async moduleInfo(refresh = false) {
    try {
      if (!refresh) {
        const cache = await ConfigModel.getItem(this.MODULE_INFO_KEY)
        if (cache)
          return cache
      }

      const profile = await this.getProfile()
      const stat = await this.getStat()
      const card = await this.getCard(profile)

      return await ConfigModel.mergeSet(this.MODULE_INFO_KEY, { profile, stat, card })
    }
    catch (e) {
      return {}
    }
  }

  /**
   * 直播签到
   */
  async sign() {
    const today = dayjs().format('YYYY-MM-DD')
    const returnRes = { date: today, success: true }

    const signInfo = await ConfigModel.getItem(this.MODULE_INFO_KEY)
    if (signInfo?.sign?.date && signInfo?.sign.date === today && signInfo?.sign.success)
      return returnRes

    const { liveApiUrl } = await ConfigModel.getItem(this.module)
    try {
      const res = await defHttp.get({
        url: `${liveApiUrl}/xlive/web-ucenter/v1/sign/DoSign`,
      })

      returnRes.success = res.data.code === 1011040
      await ConfigModel.mergeSet(this.MODULE_INFO_KEY, { sign: returnRes })
      return returnRes
    }
    catch (e) {
      returnRes.success = false
      return returnRes
    }
  }
}

export default new Bilibili()
