import type { Octokit as OctokitType } from 'octokit'
import { Octokit } from 'octokit'
import { ConfigModel } from '@models/index'
import RequestCache from '@services/base/requestCache'

export interface StarredParams {
  sort: string
  direction: string
  page: number
  per_page: number
}

class Github {
  private module = 'github'
  private octokit!: OctokitType

  constructor(token = '') {
    void this.init(token)
  }

  /**
   * 初始化
   */
  async init(token = '') {
    let authToken = token
    const { token: moduleToken, apiUrl } = await ConfigModel.getItem(this.module)
    if (!authToken) {
      if (!moduleToken)
        return false
      else
        authToken = moduleToken
    }

    const client = new Octokit({
      auth: authToken,
      baseUrl: apiUrl,
    })
    this.octokit = client
  }

  /**
   * 通用缓存请求
   * @param route string - 请求地址
   * @param params {} - 请求参数
   */
  async cacheRequest(route: string, params: Record<string, any> = {}, refresh = false) {
    try {
      const routeStr = route.replaceAll(/\s/g, '').replaceAll(/\//g, '_')
      const cacheKey = [this.module, routeStr, ...Object.values(params)]
      if (!refresh) {
        const cacheData = await RequestCache.get(cacheKey)
        if (cacheData)
          return cacheData
      }

      const res = await this.octokit.request(route, params)

      if (res)
        return await RequestCache.set(cacheKey, { data: res })

      return res
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log('[ e ] >', e)
      return false
    }
  }

  /**
   * 用户信息
   */
  async user(refresh = false) {
    return await this.cacheRequest('GET /user', undefined, refresh)
  }

  /**
   * 获取星标项目列表
   * @param params StarredParams - 参数
   */
  async starred(params: StarredParams = { sort: '', direction: '', page: 1, per_page: 20 }, refresh = false) {
    return await this.cacheRequest('GET /user/starred', params, refresh)
  }

  /**
   * 获取星标项目总数量
   */
  async starredCount(refresh = false) {
    const data = await this.starred(undefined, refresh)
    if (!data)
      return false

    const link = data.headers.link
    const pageMeta: any = String(link).match(/page\=(?<page>[\d]+)\&per_page\=(?<per_page>[\d]+)(?=>;\srel\=\"last\")/)
    const page = parseInt(pageMeta?.groups.page)
    const per_page = parseInt(pageMeta?.groups.per_page)

    const params = { page, per_page, sort: '', direction: '' }
    const lastPage = await this.starred(params, refresh)

    if (!lastPage)
      return false

    return (lastPage.data ? lastPage.data.length as number : 0) + per_page * (page - 1)
  }
}

export default new Github()
