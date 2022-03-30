import { Octokit } from 'octokit'
import type { Octokit as OctokitType } from 'octokit'
import configState from '@models/keyValue/configState'
import RequestCache from '@services/base/requestCache'
import ModuleState from '@models/keyValue/moduleState'
import type { StarredParams } from './model'

class Github {
  private module = 'github'
  private octokit!: OctokitType

  constructor() {
    this.init()
  }

  /**
   * 初始化
   */
  async init() {
    const { token, apiUrl } = await configState.getItem(this.module)
    if (!token)
      return false

    const client = new Octokit({
      auth: token,
      baseUrl: apiUrl,
    })
    this.octokit = client
  }

  /**
   * 个人信息
   */
  async me() {
    const cacheKey = [this.module, 'me']
    const cacheData = await RequestCache.get(cacheKey)
    if (cacheData)
      return cacheData

    const res = await this.octokit.request('GET /user')

    if (res)
      await RequestCache.set(cacheKey, res)

    return res
  }

  /**
   * 通用缓存请求
   * @param cacheParams [] - 缓存键
   * @param request string - 请求地址
   * @param requestParams {} - 请求参数
   */
  async cacheQuery(cacheParams: any[], request: string, requestParams: {}) {
    const cacheKey = [this.module, ...cacheParams]
    const cacheData = await RequestCache.get(cacheKey)
    if (cacheData)
      return cacheData

    const res = await this.octokit.request(request, requestParams)

    if (res)
      await RequestCache.set(cacheKey, res)

    return res
  }

  /**
   * 获取星标项目列表
   * @param params StarredParams - 参数
   */
  async starred(params: StarredParams = { sort: '', direction: '', page: 1, per_page: 20 }) {
    return await this.cacheQuery(['starred', ...Object.values(params)], 'GET /user/starred', params)
  }

  /**
   * 获取星标项目总数量
   */
  async starredCount() {
    const data = await this.starred()
    const link = data.headers.link

    const pageMeta: any = String(link).match(/page\=(?<page>[\d]+)\&per_page\=(?<per_page>[\d]+)(?=>;\srel\=\"last\")/)

    const page = parseInt(pageMeta?.groups.page)
    const per_page = parseInt(pageMeta?.groups.per_page)

    const params = { page, per_page, sort: '', direction: '' }
    const lastPage = await this.starred(params)

    return lastPage.data.length + per_page * (page - 1)
  }

  /**
   * 获取用户信息
   */
  async user(force = false) {
    if (!force) {
      const cache = await ModuleState.getValidItem(this.module)
      if (cache)
        return cache
    }

    const meRes = await this.me()
    const starredCount = await this.starredCount()

    const moduleData = {
      ...meRes.data,
      starred: starredCount,
    }

    return await ModuleState.mergeSet(this.module, { data: moduleData })
  }
}

export default new Github()
