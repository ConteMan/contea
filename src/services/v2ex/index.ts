import dayjs from 'dayjs'
import { defHttp } from '@utils/http/axios'
import configState from '@models/keyValue/configState'
import moduleState from '@models/keyValue/moduleState'
import infoList from '@models/list/infoList'
import type { Config, DomList, Mission, Module, User } from './model'

class V2EX {
  private module = 'v2ex'

  /**
   * 登录校验
   */
  async loginCheck(): Promise<boolean> {
    const { url } = await configState.getItem(this.module) as Config

    const settingUrl = `${url}/settings`
    try {
      const res = await defHttp.get({
        url: settingUrl,
      })
      return res.request.responseURL === settingUrl // 如果有 302 跳转则认为未登录
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
      data[item] = await moduleState.getItem(item) ?? {}
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
      [this.module]: this.user(),
    }

    const data = {} as any
    await Promise.all(moduleTypes.map(async (item) => {
      data.item = await relations[item] ?? {}
    }))

    return data
  }

  /**
   * 获取用户名
   */
  async getUserName(): Promise<string> {
    try {
      const { url } = await configState.getItem(this.module) as Config

      const res = await defHttp.get({ url })

      const domParser = new DOMParser()
      const dom = domParser.parseFromString(res.data, 'text/html')
      const aDoms = dom.querySelectorAll('#Top .tools a')
      const username = aDoms?.[1].getAttribute('href') ?? ''

      await moduleState.mergeSet(this.module, { data: { username }, ca_login: true }, 0)

      return username
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log('in getUserName >', e)
      return ''
    }
  }

  /**
   * 获取用户信息
   */
  async user() {
    const username = await this.getUserName()
    if (!username)
      return false

    const { url } = await configState.getItem(this.module) as Config

    try {
      const res = await defHttp.get({
        url: `${url}${username}`,
      })

      const domParser = new DOMParser()
      const dom = domParser.parseFromString(res, 'text/html')
      const mainDom = dom.querySelector('#Main')

      const idHtml = mainDom?.querySelector('span.gray')?.innerHTML
      const id = idHtml?.match(/V2EX 第 ([0-9]+?) 号会员/)?.[1]
      const created = idHtml?.match(/加入于 (.+?) /)?.[1]
      const dau = mainDom?.querySelector('span.gray a')?.innerHTML
      const online = mainDom?.querySelector('strong.online')?.innerHTML
      const balanceHtml = mainDom?.querySelector('div.balance_area')?.innerHTML
      const balanceArray = [...String(balanceHtml).matchAll(/\s?([0-9]+?)\s\</g)]
      const balance = {
        gold: balanceArray[0][1],
        silver: balanceArray[1][1],
        bronze: balanceArray[2][1],
      }
      const showName = username.split('/')?.[2]
      const signature = mainDom?.querySelector('.bigger')?.innerHTML

      const newInfo: User = {
        id,
        created,
        dau,
        online,
        balance,
        showName,
        signature,
      }

      return await moduleState.mergeSet(this.module, { data: newInfo }) as Module
    }
    catch (e) {
      return false
    }
  }

  /**
   * 签到
   */
  async mission(): Promise<Mission> {
    const { url } = await await configState.getItem(this.module) as Config

    const mainPage = await defHttp.get({ url })
    const sign = mainPage.data.match(/once=([0-9]+)/)?.[1] // 签名

    const missionUrl = `${url}/mission/daily/redeem`
    const res = await defHttp.get({
      url: missionUrl,
      params: {
        once: sign,
      },
    })

    const data = res.data
    const completed = !!data.match(/每日登录奖励已领取/)

    let days = 0
    const date = dayjs().format('YYYY-MM-DD')
    if (completed) {
      days = parseInt(data.match(/已连续登录 ([0-9]+?) 天/)?.[1])
      const info = await moduleState.getItem(this.module)
      if (!info?.mission?.days || days > info?.mission?.days) { // 并非过了零点就可以签到
        const newInfo = {
          mission: {
            date,
            days,
          },
        }
        await moduleState.mergeSet(this.module, { data: newInfo })
      }
      else {
        return {
          date,
          completed: false,
          days,
        }
      }
    }

    return {
      date,
      completed,
      days,
    }
  }

  /**
   * 获取 Tab 列表
   * @param tabName string - TAB 名称
   */

  async tabList(tabName: string) {
    const tabs = ['hot', 'all', 'tech', 'creative', 'play', 'apple', 'r2', 'members', 'qna', 'city', 'deals', 'jobs']
    if (!tabs.includes(tabName))
      return []

    const moduleType = `tab-${tabName}`
    const { url } = await await configState.getItem(this.module) as Config

    const res = await defHttp.get({
      url: `${url}/?tab=${tabName}`,
    })

    const list = this.domToList(res.data, moduleType)

    // 清理
    await infoList.deleteByModule(this.module, [moduleType])
    await infoList.bulkSetItemByModule(list, ['author', 'id'])

    return list
  }

  /**
   * 批量获取 Tab 列表
   * @param tabNames array - TAB 名称数组
   */
  async tabLists(tabNames: any[]) {
    for (const item of tabNames)
      await this.tabList(item)
  }

  /**
   * DOM 转换为 List
   * @param domStr string - DOM 字符串
   * @param moduleType string - 列表类型
   */
  domToList(domStr: string, moduleType: string) {
    const domParser = new DOMParser()
    const dom = domParser.parseFromString(domStr, 'text/html')

    const itemListDom = dom.querySelectorAll('#Main .cell.item')
    const list: DomList = []
    itemListDom.forEach((item) => {
      const title = item.querySelector('.item_title a')?.innerHTML
      const title_link = item.querySelector('.item_title a')?.getAttribute('href')
      const id = Number(title_link?.match(/\/t\/([0-9]+)/)?.[1])
      const node = item.querySelector('.topic_info > .node')?.innerHTML
      const node_link = item.querySelector('.topic_info > .node')?.getAttribute('href')
      const author = item.querySelector('.topic_info strong a')?.innerHTML
      const author_link = item.querySelector('.topic_info strong a')?.getAttribute('href')
      const last_reply_at = item.querySelector('.topic_info span')?.getAttribute('title')
      const reply_count = Number(item.querySelector('td[align=right] a')?.innerHTML)
      list.push(
        {
          ca_module: this.module,
          ca_module_type: moduleType,
          ca_sort_at: dayjs(last_reply_at).valueOf(),

          id,
          title,
          title_link,
          node,
          node_link,
          author,
          author_link,
          last_reply_at,
          reply_count,
        },
      )
    })

    return list
  }
}

export default new V2EX()
