import dayjs from 'dayjs'
import { defHttp } from '~/utils/http/axios'
import RequestCache from '~/services/base/requestCache'

class WakaTime {
  private module = 'wakatime'
  private apiUrl

  public constructor() {
    this.apiUrl = 'https://wakatime.com/api/v1'
  }

  /**
   * 获取每日汇总数据
   */
  async daySummary() {
    const cacheKey = [this.module, 'daySummary']
    const cacheData = await RequestCache.get(cacheKey)
    if (cacheData)
      return cacheData

    const day = dayjs().format('YYYY-MM-DD')

    const res = await defHttp.get({
      url: `${this.apiUrl}/users/current/summaries`,
      params: {
        start: day,
        end: day,
        cache: false,
        paywalled: true,
      },
    })

    if (res.data)
      await RequestCache.set(cacheKey, res.data)

    return res.data
  }
}

export default new WakaTime()
