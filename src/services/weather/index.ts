import type { SettingKeys } from '@setting/index'
import RequestCache from '@services/base/requestCache'
import { defHttp } from '@utils/http/axios'

export type sourceType = 'cma'

class Weather {
  private module: SettingKeys = 'weather'

  /**
   * 获取天气数据
   */
  async data(type: sourceType = 'cma', params?: any, refresh = false) {
    switch (type) {
      default:
        return await this.cma(params?.stationId, refresh)
    }
  }

  /**
   * 中国气象局数据
   * @param stationId number - 地域代码
   */
  async cma(stationId: number | undefined = undefined, refresh = false) {
    const cacheKey = [this.module, stationId]
    if (!refresh) {
      const cacheData = await RequestCache.get(cacheKey)
      if (cacheData)
        return cacheData
    }

    try {
      const res = await defHttp.get({
        url: 'https://weather.cma.cn/api/weather/view',
        params: {
          stationId,
        },
      })

      if (res.data.data)
        return await RequestCache.set(cacheKey, { data: res.data.data }, this.module, -1)

      return false
    }
    catch (e) {
      return false
    }
  }
}

export default new Weather()
