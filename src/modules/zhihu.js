import request from '@/utils/request.js'
import { infoPut } from '@/service/info.js'
import { put as platformUserPut } from '@/service/platform_user.js'
import { enablePlatformType } from '@/service/config'

export default class Zhihu {
  constructor() {
    this.baseUrl = 'https://www.zhihu.com/api'
    this.platform = 'zhihu'
    this.url_username = ''
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Zhihu()
    }
    return this.instance
  }

  // 个人信息
  userInfo = async() => {
    const url = this.baseUrl + '/v4/me'
    const res = await request.get(url)
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
      if (platformType === 'zhihu_activity') {
        const syncRes = await this.syncActivity()
        res[platformType] = syncRes
      }
    }
    return res
  }

  // 动态
  activity = async(
    {
      url = '',
      limit = 5,
      desktop = 'true',
      session_id = '',
      after_id = '',
    } = {}
  ) => {
    let res
    if (!url) {
      url = this.baseUrl + '/v3/moments/' + this.url_username + '/activities'
      const params = { limit, desktop, session_id, after_id }
      res = await request({
        url,
        params,
      })
    } else {
      res = await request.get(url)
    }
    return res.data
  }

  // 同步动态
  syncActivity = async() => {
    const returnRes = {
      success: 0,
      fail: 0
    }
    const userInfo = await this.userInfo()
    if (!userInfo) {
      return returnRes
    }
    this.url_username = userInfo.url_token
    let url = 'https://www.zhihu.com/api/v3/moments/' + this.url_username + '/activities?limit=5&desktop=true'
    let hasMore = true
    while (hasMore) {
      const res = await this.activity({ url })
      if (res['data'].length > 0) {
        for (const item of res['data']) {
          item.platform = this.platform
          item.platform_type = 'zhihu_activity'
          item.info_created_at = item.created_time
          item.info_updated_at = item.created_time
          const saveRes = await infoPut(item, ['created_time'])
          saveRes ? returnRes.success++ : returnRes.fail++
        }
      }
      hasMore = !res.paging.is_end
      url = res.paging.next
      const sleepTime = this.getRandomIntInclusive(1000, 3000)
      await this.sleep(sleepTime)
    }
    return returnRes
  }

  sleep = async(time) => {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
