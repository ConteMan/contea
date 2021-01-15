import dayjs from 'dayjs'
import request from '@/utils/request.js'
import { put as infoPut } from '@/service/info.js'
import { put as platformUserPut } from '@/service/platform_user.js'
import { enablePlatformType } from '@/service/config'

export default class Yuque {
  constructor() {
    this.baseUrl = 'https://www.yuque.com/api'
    this.platform = 'yuque'
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Yuque()
    }
    return this.instance
  }

  // 个人信息
  userInfo = async() => {
    const url = this.baseUrl + '/mine?'
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
      this.putPlatformUser(res.data)
      return 1
    }
  }

  // 保存个人信息
  putPlatformUser = async(data = {}) => {
    if (!data) {
      const res = await this.userInfo()
      data = res.data
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
      if (platformType === 'yuque_note') {
        const syncRes = await this.syncNote()
        res[platformType] = syncRes
      }
    }
    return res
  }

  // 获取小记
  note = async(
    {
      filter_type = 'all',
      offset = 0,
      order = 'content_updated_at',
      q = ''
    } = {}
  ) => {
    const url = this.baseUrl + '/notes'
    const params = { filter_type, offset, order, q }

    const res = await request({
      url,
      method: 'get',
      params,
    })
    return res.data
  }

  // 同步小记
  syncNote = async(
    {
      filter_type = 'all',
      order = 'content_updated_at',
      offset = 0
    } = {}
  ) => {
    const returnRes = {
      success: 0,
      fail: 0
    }
    let hasMore = true
    const pageSize = 10
    while (hasMore) {
      const res = await this.note({ filter_type, order, offset })
      const items = res['data']
      if (items.length > 0) {
        for (const item of items) {
          item.platform = this.platform
          item.platform_type = 'yuque_note'
          item.info_created_at = dayjs(item.first_published_at).unix()
          item.info_updated_at = dayjs(item.updated_at).unix()
          const saveRes = await infoPut(item, ['id', 'slug'])
          saveRes ? returnRes.success++ : returnRes.fail++
        }
      }
      hasMore = res.meta.hasMore
      if (hasMore) {
        offset += pageSize
      }
    }
    return returnRes
  }
}
