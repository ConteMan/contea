import { defHttp } from '@utils/http/axios'
import { sleep } from '@utils/index'
import ConfigModel from '@models/config'

class WeRead {
  private MODULE = 'weread'
  private MODULE_INFO_KEY = 'weread_module_info'

  /**
   * 登录检测
   * @returns boolean
   */
  async loginCheck(): Promise<boolean> {
    return !!(await this.getUserId()) && !!(this.getUser())
  }

  /**
   * 刷新登录
   */
  async refreshLogin() {
    try {
      const { site: url } = await ConfigModel.getItem(this.MODULE)
      await defHttp.get({ url })
      await sleep(1000)
      return true
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取用户 ID
   */
  async getUserId(times = 2): Promise<boolean | string> {
    const { site: url } = await ConfigModel.getItem(this.MODULE)

    const res = await browser.cookies.get({ url, name: 'wr_vid' })
    if (res)
      return res.value

    if (times > 1) {
      await this.refreshLogin()
      return this.getUserId(--times)
    }

    return false
  }

  /**
   * 获取用户信息
   */
  async getUser() {
    const { apiUrl } = await ConfigModel.getItem(this.MODULE)

    const userVid = await this.getUserId()
    if (!userVid)
      return false

    try {
      const res = await defHttp.get({
        url: `${apiUrl}/user`,
        params: {
          userVid,
        },
      })
      if (res.data?.errCode)
        return false
      else
        return await ConfigModel.mergeSet(this.MODULE_INFO_KEY, { user: res.data })
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取无限卡信息
   */
  async getMemberCard() {
    const { apiUrl } = await ConfigModel.getItem(this.MODULE)

    try {
      const res = await defHttp.get({
        url: `${apiUrl}/pay/memberCardSummary`,
        params: {
          pf: 'ios',
        },
      })
      if (res.data?.errCode)
        return false
      else
        return await ConfigModel.mergeSet(this.MODULE_INFO_KEY, { memberCard: res.data })
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取阅读详情
   * @param type number - 类型，0 周数据，1 月数据
   * @param count number - 请求数量
   */
  async readDetail(type: 0 | 1 = 0, count = 1) {
    const { apiUrl_2 } = await ConfigModel.getItem(this.MODULE)

    try {
      const res = await defHttp.get({
        url: `${apiUrl_2}/readdetail`,
        params: {
          type,
          count,
        },
      })
      if (res.data?.errCode) {
        return false
      }
      else {
        const data = res.data
        const showBooks = data.readDetail?.datas?.[0]?.readMeta?.books
        if (showBooks) {
          for (let index = 0; index < showBooks.length; index++)
            showBooks[index].detail = await this.bookInfo(showBooks[index].bookId)

          data.readDetail.datas[0].readMeta.books = showBooks
        }
        return await ConfigModel.mergeSet(this.MODULE_INFO_KEY, { readDetail: data })
      }
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取书籍信息
   * @param bookId string - 书籍ID
   */
  async bookInfo(bookId: string) {
    const { apiUrl_2 } = await ConfigModel.getItem(this.MODULE)

    if (!await this.loginCheck())
      return false

    try {
      const res = await defHttp.get({
        url: `${apiUrl_2}/book/info`,
        params: {
          bookId,
        },
      })
      if (res.data?.errCode)
        return false
      else
        return res.data
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取模块信息
   */
  async moduleInfo(refresh = false) {
    try {
      if (!refresh) {
        const cache = await ConfigModel.getItem(this.MODULE_INFO_KEY)
        if (cache)
          return cache
      }

      await this.getUser()
      await this.getMemberCard()
      await this.readDetail()

      return await ConfigModel.getItem(this.MODULE_INFO_KEY)
    }
    catch (e) {
      return {}
    }
  }

  /**
   * 获取书架信息
   */
  async shelf() {
    const { apiUrl } = await ConfigModel.getItem(this.MODULE)

    if (!await this.loginCheck())
      return false

    try {
      const res = await defHttp.get({
        url: `${apiUrl}/shelf/sync`,
      })
      if (res.data?.errCode)
        return false
      else
        return res.data
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取书籍的文章列表
   */
  async bookArticles(bookId: string, count = 10, offset = 0) {
    const { apiUrl_2 } = await ConfigModel.getItem(this.MODULE)

    if (!await this.loginCheck())
      return false

    try {
      const res = await defHttp.get({
        url: `${apiUrl_2}/book/articles`,
        params: {
          bookId,
          count,
          offset,
        },
      })
      if (res.data?.errCode)
        return false
      else
        return res.data
    }
    catch (e) {
      return false
    }
  }
}

export default new WeRead()
