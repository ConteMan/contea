import { defHttp } from '@utils/http/axios'
import { sleep } from '@utils/index'
import { ConfigModel } from '@models/index'

class WeRead {
  private MODULE = 'weread'
  private MODULE_INFO_KEY = 'weread_module_info'

  /**
   * 登录检测
   * @returns boolean
   */
  async loginCheck(): Promise<boolean> {
    try {
      const user = await this.getUser()
      if (user)
        return true
      return await this.refreshLogin()
    }
    catch (e) {
      return false
    }
  }

  /**
   * 刷新登录
   */
  async refreshLogin() {
    try {
      const { site: url } = await ConfigModel.getItem(this.MODULE)
      const res = await defHttp.get({ url })
      await sleep(1000)
      if ([200].includes(res.status))
        return true
      else
        return false
    }
    catch (e) {
      return false
    }
  }

  /**
   * 通过首页脚本获取整体信息
   */
  async total() {
    try {
      const loginStatus = await this.loginCheck()
      if (!loginStatus)
        return false

      const { site: url } = await ConfigModel.getItem(this.MODULE)
      const res = await defHttp.get({ url })

      if (![200].includes(res.status))
        return false

      const body = res.data
      const regexRes = body.match(/(\{.*\})\;/)
      if (!regexRes[1])
        return false
      const data = JSON.parse(regexRes[1])
      const {
        user,
        homeStoreModule: rankList,
        shelfStoreModule: shelf,
      } = data

      return {
        user,
        rankList,
        shelf,
      }
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      return false
    }
  }

  /**
   * 获取用户 ID
   */
  async getUserId(): Promise<boolean | string> {
    const { site: url } = await ConfigModel.getItem(this.MODULE)

    const res = await browser.cookies.get({ url, name: 'wr_vid' })
    if (res)
      return res.value
    return false
  }

  /**
   * 获取用户信息
   */
  async getUser() {
    try {
      const { apiUrl } = await ConfigModel.getItem(this.MODULE)

      const userVid = await this.getUserId()
      if (!userVid)
        return false

      const res = await defHttp.get({
        url: `${apiUrl}/user`,
        params: {
          userVid,
        },
      })
      if (res.status !== 200 || res.data?.errCode)
        return false
      else
        return res.data
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取无限卡信息
   */
  async getMemberCard() {
    try {
      const { apiUrl } = await ConfigModel.getItem(this.MODULE)

      const res = await defHttp.get({
        url: `${apiUrl}/pay/memberCardSummary`,
        params: {
          pf: 'ios',
        },
      })
      if (res.status !== 200 || res.data?.errCode)
        return false
      else
        return res.data
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
      if (res.status !== 200 || res.data?.errCode) {
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
        return data
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
      if (res.status !== 200 || res.data?.errCode)
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

      if (!await this.loginCheck())
        return false

      const totalRes = await this.total()
      if (!totalRes)
        return false
      const { user, rankList, shelf } = totalRes

      const memberCard = await this.getMemberCard()
      const readDetail = await this.readDetail()

      const data = {
        user,
        shelf,
        memberCard,
        readDetail,
        rankList,
      }

      await ConfigModel.mergeSet(this.MODULE_INFO_KEY, data)

      return data
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      return false
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
      if (res.status !== 200 || res.data?.errCode)
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
      if (res.status !== 200 || res.data?.errCode)
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
