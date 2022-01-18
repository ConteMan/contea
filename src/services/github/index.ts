import { Octokit } from '@octokit/core'
import type { Octokit as OctokitType } from '@octokit/core'
import RequestCache from '../base/requestCache'
import type { StarredParams } from './model'
import ConfigState from '~/models/keyValue/configState'
import ModuleState from '~/models/keyValue/moduleState'

class Github {
  private module = 'github'
  private octokit!: OctokitType
  // private username!: string

  constructor() {
    this.init()
  }

  /**
   * 初始化
   */
  async init() {
    const { token, apiUrl } = await ConfigState.getItem(this.module)
    if (!token)
      return false

    const client = new Octokit({
      auth: token,
      baseUrl: apiUrl,
    })
    this.octokit = client
    // eslint-disable-next-line no-console
    console.log('%c [ client ]-18', 'font-size:13px; background:pink; color:#bf2c9f;', client)

    // const moduleState = await ModuleState.getItem(this.module)
    // if (moduleState?.login) {
    //   this.username = moduleState?.login
    // }
    // else {
    //   const user = await this.me()
    //   this.username = user.data.login
    // }
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

    ModuleState.setItem(this.module, res.data)

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

  async getStarredCount() {
    const data = await this.starred()
    const link = data.headers.link

    const pageMeta = [...String(link).matchAll(/\s*page\=([\d]+)\&per_page\=([\d]+)\s*/g)]
    // eslint-disable-next-line no-console
    console.log('%c [ pageMeta ]-93', 'font-size:13px; background:pink; color:#bf2c9f;', pageMeta)
    const params = { page: parseInt(pageMeta[1][1]), per_page: parseInt(pageMeta[1][2]), sort: '', direction: '' }
    const lastPage = await this.starred(params)
    return lastPage.data.length + parseInt(pageMeta[1][2]) * (parseInt(pageMeta[1][1]) - 1)
  }
}

export default new Github()
