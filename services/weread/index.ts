import { defHttp } from '@utils/http/axios'
import { sleep } from '@utils/index'
import configState from '@models/keyValue/configState'
import moduleState from '@models/keyValue/moduleState'
import type { Config } from './model'
import { ModuleType } from './model'

class WeRead {
  private module = 'weread'

  /**
   * 登录检测
   * @returns boolean
   */
  async loginCheck(): Promise<boolean> {
    return !!(await this.getUserId()) && !!(this.me())
  }

  /**
   * 获取模块类型数据
   * @param moduleTypes 要更新模块类型，数组
   */
  async moduleTypeData(moduleTypes: string[] = []) {
    if (!moduleTypes.length) {
      moduleTypes = [
        this.module,
        `${this.module}_${ModuleType.MEMBER_CARD}`,
        `${this.module}_${ModuleType.READ_DETAIL}`,
      ]
    }

    const data = {} as any
    await Promise.all(moduleTypes.map(async(item) => {
      data[item] = await moduleState.storage.query().get(item) ?? {}
    }))
    return data
  }

  /**
   * 更新模块类型数据
   * @param moduleTypes 要更新模块类型，数组
   */
  async updateModuleTypeData(moduleTypes: string[] = []) {
    if (!moduleTypes.length) {
      moduleTypes = [
        this.module,
        `${this.module}_${ModuleType.MEMBER_CARD}`,
        `${this.module}_${ModuleType.READ_DETAIL}`,
      ]
    }

    const relations = {
      [this.module]: this.me(),
      [`${this.module}_${ModuleType.MEMBER_CARD}`]: this.memberCard(),
      [`${this.module}_${ModuleType.READ_DETAIL}`]: this.readDetail(),
    }

    await this.refreshLogin()

    const data = {} as any
    await Promise.all(moduleTypes.map(async(item) => {
      data.item = await relations[item] ?? {}
    }))

    return data
  }

  /**
   * 获取用户ID
   */
  async getUserId(times = 2): Promise<boolean | string> {
    const { site: url } = await configState.getItem(this.module)

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
   * 刷新登录
   */
  async refreshLogin() {
    const { site: url } = await configState.getItem(this.module)
    await defHttp.get({ url })
    await sleep(1000)
    return true
  }

  /**
   * 获取个人信息
   */
  async me() {
    const { apiUrl } = await configState.getItem(this.module)

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
        return await moduleState.mergeSet(this.module, { data: res.data })
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取无限卡信息
   */
  async memberCard() {
    const cacheKey = `${this.module}_${ModuleType.MEMBER_CARD}`
    const { apiUrl } = await configState.getItem(this.module)

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
        return await moduleState.mergeSet(cacheKey, { data: res.data }, false)
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
    const cacheKey = `${this.module}_${ModuleType.READ_DETAIL}`
    const { apiUrl_2 } = await configState.getItem(this.module)

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
        return await moduleState.mergeSet(cacheKey, { data }, false)
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
