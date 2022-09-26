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
    if (!res)
      return false

    if (!res?.ca_expired_at)
      return false

    if (!withExpired && res.ca_expired_at)
      delete res.ca_expired_at

    if (res.ca_expired_at < 0)
      return { ...res, cache_sign: 'get' }

    if (!res?.ca_expired_at || res?.ca_expired_at < now)
      return false

    return { ...res, cache_sign: 'get' }
  }

  /**
   * 设置缓存
   * @param key - 键数组
   * @param data - 缓存内容
   * @param module - 取用过期时间模块，可选，默认 base
   * @param expired - 过期时间，单位：秒；0 使用默认过期设置；-1 不过期；
   */
  async set(key: any[], data: any, module: SettingKeys | undefined = 'base', expired = 0) {
    if (!expired) {
      const { expired: moduleExpired } = await ConfigModel.getItem(module)
      expired = parseInt(moduleExpired) ?? 0
    }

    const now = new Date().getTime()
    const keyString = key.join('_')

    data.ca_updated_at = now
    data.ca_expired_at = expired >= 0 ? (now + expired * 1000) : -1

    await CacheModel.addOrUpdateItem(keyString, data)

    data.cache_sign = 'set'
    return data
  }
}

export default new RequestCache()
