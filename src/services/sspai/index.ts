import dayjs from 'dayjs'
import type { Config, User } from './model'
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
   * 获取关注的人的动态
   */
  async followActivity() {
    const moduleType = 'followActivity'

    const { apiUrl } = await this.getConfig()

    const jwtToken = await this.getToken()
    const now = dayjs().unix()
    const res = await defHttp.get({
      url: `${apiUrl}/information/user/activity/user/page/get?limit=10&offset=0&created_at=${now}`,
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
          ca_sort_at: item.created_at * 1000,
          ca_author_id: item.author.id,

          ...item,
        },
      )
    })

    // eslint-disable-next-line no-console
    console.log(list)

    await infoList.bulkSetItemByModule(list, ['ca_author_id', 'created_at'])

    return list
  }

  /**
   * 根据类型获取信息列表
   * @param types [] - 类型数组
   */
  async lists(types: any[]) {
    for (const type of types) {
      if (type === 'FOLLOWED')
        await this.followActivity()
    }
    return true
  }
}

export default new Sspai()
