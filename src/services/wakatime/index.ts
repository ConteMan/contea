import { defHttp } from '~/utils/http/axios'
import ConfigState from '~/models/keyValue/configState'
import RequestCache from '~/services/base/requestCache'
class WakaTime {
  private module = 'wakatime'
  private today = dayjs().format('YYYY-MM-DD')

  /**
   * 获取按日统计汇总数据
   * @param startDate string - 开始日期
   * @param endDate string - 结束日期
   */
  async daySummary(startDate = this.today, endDate = this.today, refresh = false) {
    const cacheKey = [this.module, 'daySummary', startDate, endDate]

    if (!refresh) {
      const cacheData = await RequestCache.get(cacheKey)
      if (cacheData)
        return cacheData
    }

    const { apiUrl } = await ConfigState.getItem(this.module)

    const res = await defHttp.get({
      url: `${apiUrl}/users/current/summaries`,
      params: {
        start: startDate,
        end: endDate,
        cache: false,
        paywalled: true,
      },
    })

    if (res.data) {
      const expried = startDate !== endDate ? 43200 : 0 // 如果不是查询当日的数据，设置缓存时间为半天
      return await RequestCache.set(cacheKey, res.data, this.module, expried)
    }

    return res.data
  }
}

export default new WakaTime()
