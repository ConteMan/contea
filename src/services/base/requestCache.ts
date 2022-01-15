import configState from '~/models/keyValue/configState'
import requestState from '~/models/keyValue/requestState'

class RequestCache {
  /**
   * 获取缓存
   * @param key any[] - 键数组
   */
  async get(key: any[]) {
    const now = new Date().getTime()
    const keyString = key.join('_')
    const res = await requestState.getItem(keyString)
    if (!res || res?.expried < now)
      return false
    return res
  }

  /**
   * 设置缓存
   * @param key any[] - 键数组
   * @param data any - 缓存内容
   * @param module string - 取用过期时间模块，可选，默认 default
   */
  async set(key: any[], data: any, module = 'default') {
    const { expried } = await configState.getItem(module)
    const now = new Date().getTime()
    const keyString = key.join('_')

    data.expried = now + expried * 1000
    return await requestState.setItem(keyString, data)
  }
}

export default new RequestCache()
