import configState from '~/models/keyValue/configState'
import requestState from '~/models/keyValue/requestState'

class RequestCache {
  /**
   * 获取缓存
   * @param key any[] - 键数组
   * @param withExpried boolean - 是否携带过期时间信息，默认不带
   */
  async get(key: any[], withExpried?: false) {
    const now = new Date().getTime()
    const keyString = key.join('_')
    const res = await requestState.getItem(keyString)
    if (!res || res?.expried < now)
      return false

    if (!withExpried)
      delete res.expried

    return res
  }

  /**
   * 设置缓存
   * @param key any[] - 键数组
   * @param data any - 缓存内容
   * @param module string - 取用过期时间模块，可选，默认 default
   * @param expried number - 过期时间，单位：秒
   */
  async set(key: any[], data: any, module = 'default', expried = 0) {
    if (!expried) {
      const { expried: moduleExpried } = await configState.getItem(module)
      expried = parseInt(moduleExpried) ?? 0
    }
    const now = new Date().getTime()
    const keyString = key.join('_')

    data.expried = now + expried * 1000
    return await requestState.setItem(keyString, data)
  }
}

export default new RequestCache()
