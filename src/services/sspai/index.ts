import dayjs from 'dayjs'
import { defHttp } from '@utils/http/axios'
import ConfigModel from '@models/config'
import Info from '@models/info'
import { toDesktop } from '@services/desktop'
import type { Paginate } from './model'
class Sspai {
  private module = 'sspai'
  private moduleInfoKey = 'sspai_module_info'

  /**
   * 登录检测
   * @returns boolean
   */
  async loginCheck() {
    const { url } = await ConfigModel.getItem(this.module)

    try {
      const res = await browser.cookies.get({ url, name: 'sspai_jwt_token' })
      return !!res?.value
    }
    catch (error) {
      return false
    }
  }

  /**
 * 获取模块类型数据
 * @param moduleTypes 要更新模块类型，数组
 */
  async moduleTypeData(moduleTypes: string[] = []) {
    if (!moduleTypes.length) {
      moduleTypes = [
        this.module,
      ]
    }

    const data = {} as any
    await Promise.all(moduleTypes.map(async (item) => {
      data[item] = await ConfigModel.getItem(this.moduleInfoKey) ?? {}
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
      ]
    }

    const relations = {
      [this.module]: this.moduleInfo(),
    }

    const data = {} as any
    await Promise.all(moduleTypes.map(async (item) => {
      data.item = await relations[item] ?? {}
    }))

    return data
  }

  /**
   * 获取 Token
   * @returns string
   */
  async getToken() {
    const { url } = await ConfigModel.getItem(this.module)

    const res = await browser.cookies.get({ url, name: 'sspai_jwt_token' })
    return res?.value
  }

  /**
   * 获取用户信息
   */
  async moduleInfo(refresh = false) {
    const { apiUrl } = await ConfigModel.getItem(this.module)
    let cache = {}
    if (!refresh) {
      cache = await ConfigModel.getItem(this.moduleInfoKey)
      if (Object.keys(cache))
        return cache
    }

    const jwtToken = await this.getToken()
    const res = await defHttp.get({
      url: `${apiUrl}/user/info/get`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })

    if (res.data.data)
      return await ConfigModel.mergeSet(this.moduleInfoKey, { data: res.data.data })
    else
      return {}
  }

  /**
   * 获取关注的人的动态列表
   */
  async followActivity(paginate: Paginate = { limit: 10, offset: 0 }) {
    const moduleType = 'followActivity'

    const { apiUrl } = await ConfigModel.getItem(this.module)
    const jwtToken = await this.getToken()

    const now = dayjs().unix()
    const { limit, offset } = paginate
    const res = await defHttp.get({
      url: `${apiUrl}/information/user/activity/user/page/get?limit=${limit}&offset=${offset}&created_at=${now}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })

    const data = res.data.data

    const list: any = []
    data.forEach((item: any) => {
      const dealItem = {
        ca_module: this.module,
        ca_module_type: moduleType,
        ca_sort_at: item.data.released_time * 1000,

        ca_data_id: item.data.id,
        ca_author_slug: item.data.author.slug,

        data: item,
      }
      list.push(
        dealItem,
      )
    })

    await Info.deleteByModule(this.module, [moduleType])
    await Info.bulkSetItemByModule(list, ['ca_data_id'])

    await toDesktop(this.module, list)

    return list
  }

  /**
   * 获取信息列表, 通用
   * @param paginate Paginate - 分页数据
   */
  async commonList(moduleType = 'index', paginate: Paginate = { limit: 10, offset: 0 }) {
    const { apiUrl } = await ConfigModel.getItem(this.module)
    const jwtToken = await this.getToken()

    const now = dayjs().unix()
    const { limit, offset } = paginate
    const res = await defHttp.get({
      url: `${apiUrl}/article/${moduleType}/page/get?limit=${limit}&offset=${offset}&created_at=${now}`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })

    const data = res.data.data

    const list: any = []
    data.forEach((item: any) => {
      const dealItem = {
        ca_module: this.module,
        ca_module_type: moduleType,
        ca_sort_at: item.released_time * 1000,

        ca_data_id: item.id,
        ca_author_slug: item.author.slug,

        data: item,
      }
      list.push(
        dealItem,
      )
    })

    await Info.deleteByModule(this.module, [moduleType])
    await Info.bulkSetItemByModule(list, ['ca_data_id'])

    await toDesktop(this.module, list)

    return list
  }

  /**
   * 获取首页信息列表
   * @param paginate Paginate - 分页数据
   */
  async indexList(paginate: Paginate = { limit: 20, offset: 0 }) {
    return await this.commonList('index', paginate)
  }

  /**
   * 获取 Matrix 信息列表
   * @param paginate Paginate - 分页数据
   */
  async matrixList(paginate: Paginate = { limit: 20, offset: 0 }) {
    return await this.commonList('matrix', paginate)
  }

  /**
   * 定时更新，根据类型获取信息列表
   * @param types [] - 类型数组
   */
  async lists(types: any[]) {
    if (types.includes('followActivity'))
      await this.followActivity()
    if (types.includes('index'))
      await this.indexList()
    if (types.includes('matrix'))
      await this.matrixList()
    return true
  }
}

export default new Sspai()
