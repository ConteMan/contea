import dayjs from 'dayjs'
import type { Config, User, Paginate } from './model'
import { defHttp } from '~/utils/http/axios'
import { deepMerge } from '~/utils'
import configState from '~/models/keyValue/configState'
import moduleState from '~/models/keyValue/moduleState'
import infoList from '~/models/list/infoList'
class Sspai {
  private moduleName = 'sspai'

  async getConfig(): Promise<Config> {
    return await configState.getItem(this.moduleName)
  }

  /**
   * 登录检测
   * @returns boolean
   */
  async loginCheck() {
    const { url } = await this.getConfig()

    try {
      const res = await browser.cookies.get({ url, name: 'sspai_jwt_token' })
      return !!res?.value
    }
    catch (error) {
      return false
    }
  }

  /**
   * 获取 Token
   * @returns string
   */
  async getToken() {
    const { url } = await this.getConfig()

    const res = await browser.cookies.get({ url, name: 'sspai_jwt_token' })
    return res?.value
  }

  /**
   * 获取用户信息
   */
  async user(): Promise<User> {
    const { apiUrl, key, expried } = await this.getConfig()
    const info = await moduleState.getItem(key)

    const now = new Date().getTime()
    if (info && info?.expried > now)
      return info

    const jwtToken = await this.getToken()
    const res = await defHttp.get({
      url: `${apiUrl}/user/info/get`,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    const newInfo = deepMerge(info, {
      updatedAt: now,
      expried: now + expried * 1000,

      ...res.data.data,
    })

    await moduleState.setItem(key, newInfo)

    return newInfo as User
  }

  /**
   * 获取关注的人的动态列表
   */
  async followActivity(paginate: Paginate = { limit: 10, offset: 0 }) {
    const moduleType = 'followActivity'

    const { apiUrl } = await this.getConfig()
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
      list.push(
        {
          ca_module: this.moduleName,
          ca_module_type: moduleType,
          ca_sort_at: item.data.created_time * 1000,

          ca_data_id: item.data.id,
          ca_author_slug: item.data.author.slug,

          ...item,
        },
      )
    })

    // eslint-disable-next-line no-console
    console.log(list)

    const deleteCount = await infoList.deleteByModule(this.moduleName, [moduleType])
    // eslint-disable-next-line no-console
    console.log('%c [ deleteCount ]-160', 'font-size:13px; background:pink; color:#bf2c9f;', deleteCount)
    await infoList.bulkSetItemByModule(list, ['ca_data_id', 'ca_author_slug'])

    return list
  }

  /**
   * 获取信息列表, 通用
   * @param paginate Paginate - 分页数据
   */
  async commonList(moduleType = 'index', paginate: Paginate = { limit: 10, offset: 0 }) {
    const { apiUrl } = await this.getConfig()
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
      list.push(
        {
          ca_module: this.moduleName,
          ca_module_type: moduleType,
          ca_sort_at: item.created_time * 1000,

          ca_data_id: item.id,
          ca_author_slug: item.author.slug,

          ...item,
        },
      )
    })

    // eslint-disable-next-line no-console
    console.log(list)

    const deleteCount = await infoList.deleteByModule(this.moduleName, [moduleType])
    // eslint-disable-next-line no-console
    console.log('%c [ deleteCount ]-160', 'font-size:13px; background:pink; color:#bf2c9f;', deleteCount)
    await infoList.bulkSetItemByModule(list, ['ca_data_id', 'ca_author_slug'])

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
    for (const type of types) {
      if (type === 'followActivity')
        await this.followActivity()
      if (type === 'index')
        await this.indexList()
      if (type === 'matrix')
        await this.matrixList()
    }
    return true
  }
}

export default new Sspai()
