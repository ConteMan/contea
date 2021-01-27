import dayjs from 'dayjs'
import request from '@/utils/request.js'
import { infoPut } from '@/service/info.js'
import { put as platformUserPut } from '@/service/platform_user.js'
import { enablePlatformType } from '@/service/config'

export default class Flomo {
  constructor() {
    this.baseUrl = 'https://flomoapp.com/api'
    this.platform = 'flomo'
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Flomo()
    }
    return this.instance
  }

  // 个人信息
  userInfo = async() => {
    const url = 'https://flomoapp.com/login'
    const res = await request({
      url,
    })
    const htmlDom = res.status !== 200 ? false : res.data
    if (!htmlDom) {
      return false
    }
    const meArray = htmlDom.match(/const[\s]me[\s]=[\s]({[\s\S]*})/)
    if (meArray[1]) {
      const me = JSON.parse(meArray[1])
      return me
    } else {
      return false
    }
  }

  // 标签
  tag = async() => {
    const url = this.baseUrl + '/tag'
    const res = await request({
      url,
    })
    return res.status !== 200 ? false : res.data
  }

  // 登录状态
  loginStatus = async() => {
    const res = await this.userInfo()
    if (!res) {
      return 0
    } else {
      this.putPlatformUser(res)
      return 1
    }
  }

  // 保存个人信息
  putPlatformUser = async(data = {}) => {
    if (!data) {
      data = await this.userInfo()
    }
    data.platform = this.platform
    return await platformUserPut(data)
  }

  // 同步数据
  sync = async() => {
    const res = {}
    const loginStatus = await this.loginStatus()
    if (!loginStatus) {
      return res
    }
    const platformTypes = await enablePlatformType(this.platform)
    for (const platformType of platformTypes) {
      if (platformType === 'flomo_memo') {
        const syncRes = await this.syncMemo()
        res[platformType] = syncRes
      }
    }
    return res
  }

  // 获取 memo
  memo = async({ offset = 0 } = {}) => {
    const url = this.baseUrl + '/memo'
    const params = {
      offset
    }
    const res = await request({
      url,
      method: 'get',
      params,
    })
    return res.data
  }

  // 同步小记
  syncMemo = async({ offset = 0 } = {}) => {
    const platformType = 'flomo_memo'
    const returnRes = {
      success: 0,
      fail: 0
    }
    let hasMore = true
    const pageSize = 50
    while (hasMore) {
      const res = await this.memo({ offset })
      const items = res.memos
      if (items.length > 0) {
        for (const item of items) {
          item.platform = this.platform
          item.platform_type = platformType
          item.info_created_at = dayjs(item.created_at).unix()
          item.info_updated_at = dayjs(item.created_at).unix()
          const saveRes = await infoPut(item, ['slug'])
          saveRes ? returnRes.success++ : returnRes.fail++
        }
      }
      hasMore = items.length === pageSize
      if (hasMore) {
        offset += pageSize
      }
    }
    return returnRes
  }
}
