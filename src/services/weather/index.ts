import { defHttp } from '~/utils/http/axios'
import RequestCache from '~/services/base/requestCache'
class Weather {
  private moduleName = 'weather'
  /**
   * 获取天气数据
   */
  async data(type = 'cma', params?: any) {
    switch (type) {
      default:
        return await this.cma(params?.stationId)
    }
  }

  /**
   * 中国气象局数据
   * @param stationId number - 地域代码
   * @returns {}
   */
  async cma(stationId: number | null = null) {
    const cacheKey = [this.moduleName, stationId]
    const cacheData = await RequestCache.get(cacheKey)
    if (cacheData)
      return cacheData

    const res = await defHttp.get({
      url: 'https://weather.cma.cn/api/weather/view',
      params: {
        stationId,
      },
    })

    if (res.data.data)
      await RequestCache.set(cacheKey, res.data.data)

    return res.data.data
  }
}

export default new Weather()
