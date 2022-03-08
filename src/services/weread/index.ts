import type { Config, User } from './model'
import { defHttp } from '~/utils/http/axios'
import configState from '~/models/keyValue/configState'
import moduleState from '~/models/keyValue/moduleState'

class WeRead {
  private module = 'weread'

  /**
   * 获取用户ID
   */
  async getUserId(times = 2): Promise<boolean | string> {
    const { site: url } = await configState.getItem(this.module)

    const res = await browser.cookies.get({ url, name: 'wr_vid' })
    if (res)
      return res.value

    if (times > 1) {
      await defHttp.get({ url })
      return this.getUserId(--times)
    }

    return false
  }

  /**
   * 登录检测
   * @returns boolean
   */
  async loginCheck(): Promise<boolean> {
    return !!(await this.getUserId())
  }

  /**
   * 获取个人信息
   */
  async me() {
    const { apiUrl } = await configState.getItem(this.module)

    const userVid = await this.getUserId()
    if (!userVid)
      return false

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
    const moduleType = 'memberCard'
    const { apiUrl } = await configState.getItem(this.module)

    if (!await this.loginCheck())
      return false

    try {
      const res = await defHttp.get({
        url: `${apiUrl}/pay/memberCardSummary`,
        params: {
          pf: 'ios',
        },
      })
      const cacheData = res.data
      return await moduleState.mergeSet(`${this.module}_${moduleType}`, cacheData)
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取阅读详情
   * @param type number - 类型
   * @param count number - 请求数量
   */
  async readDetail(type: 0 | 1 = 0, count = 1) {
    const moduleType = 'readdetail'
    const { apiUrl_2 } = await configState.getItem(this.module)

    if (!await this.loginCheck())
      return false

    try {
      const res = await defHttp.get({
        url: `${apiUrl_2}/readdetail`,
        params: {
          type,
          count,
        },
      })
      const cacheData = res.data
      return await moduleState.mergeSet(`${this.module}_${moduleType}`, cacheData)
    }
    catch (e) {
      return false
    }
  }

  /**
   * 通过缓存获取个人信息
   * @param force boolean - 是否强制更新
   */
  async user(force = false) {
    if (!force) {
      const cache = await moduleState.getItem(this.module)
      if (cache)
        return cache
    }

    if (!this.loginCheck())
      return false

    const { site: url } = await configState.getItem(this.module)
    await defHttp.get({ url })

    const newData = {} as any
    newData.user = await this.me()
    newData.memberCard = await this.memberCard()
    newData.readDetail = await this.readDetail()
    const showBooks = newData.readDetail?.datas?.[0]?.readMeta?.books
    if (showBooks) {
      for (let index = 0; index < showBooks.length; index++)
        showBooks[index].detail = await this.bookInfo(showBooks[index].bookId)

      newData.readDetail.datas[0].readMeta.books = showBooks
    }

    return await moduleState.mergeSet(this.module, newData)
  }

  /**
   * 获取书籍信息
   * @param bookId string - 书籍ID
   */
  async bookInfo(bookId: string) {
    const { apiUrl_2 } = await configState.getItem(this.module)

    if (!await this.loginCheck())
      return false

    try {
      const res = await defHttp.get({
        url: `${apiUrl_2}/book/info`,
        params: {
          bookId,
        },
      })
      return res.data
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取书架信息
   */
  async shelf() {
    const { apiUrl } = await configState.getItem(this.module) as Config

    if (!await this.loginCheck())
      return false

    try {
      const res = await defHttp.get({
        url: `${apiUrl}/shelf/sync`,
      })
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
    const { apiUrl_2 } = await configState.getItem(this.module) as Config

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
      return res.data
    }
    catch (e) {
      return false
    }
  }
}

export default new WeRead()
