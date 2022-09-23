import type { SettingKeys } from '@setting/index'

import { CacheModel, ConfigModel } from '@models/index'

class RequestCache {
  /**
   * 获取缓存
   * @param key any[] - 键数组
   * @param withExpired boolean - 是否携带过期时间信息，默认不带
   */
  async get(key: any[], withExpired = true) {
    const now = new Date().getTime()
    const keyString = key.join('_')
    const res = await CacheModel.getItem(keyString)
    if (!res || !res?.ca_expired_at || res?.ca_expired_at < now)
      return false

    if (!withExpired)
      delete res.ca_expired_at

    return res
  }

  /**
   * 设置缓存
   * @param key any[] - 键数组
   * @param data any - 缓存内容
   * @param module string - 取用过期时间模块，可选，默认 base
   * @param expired number - 过期时间，单位：秒
   */
  async set(key: any[], data: any, module: SettingKeys = 'base', expired = 0) {
    if (!expired) {
      const { expired: moduleExpired } = await ConfigModel.getItem(module)
      expired = parseInt(moduleExpired) ?? 0
    }

    const now = new Date().getTime()
    const keyString = key.join('_')

    data.ca_updated_at = now
    data.ca_expired_at = now + expired * 1000

    await CacheModel.addOrUpdateItem(keyString, data)
    return data
  }
}

export default new RequestCache()
