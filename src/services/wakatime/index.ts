import { defHttp } from '~/utils/http/axios'
import ConfigState from '~/models/keyValue/configState'
import RequestCache from '~/services/base/requestCache'

class WakaTime {
  private module = 'wakatime'
  private today = dayjs().format('YYYY-MM-DD')

  /**
   * 登录检测（通过查询必要 cookie）
   * @returns Promise<boolean>
   */
  async loginCheck(): Promise<boolean> {
    const { site } = await ConfigState.getItem(this.module)

    try {
      const res = await browser.cookies.get({ url: site, name: 'remember_token' })
      return !!res?.value
    }
    catch (error) {
      return false
    }
  }

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

    const login = await this.loginCheck()
    if (!login)
      return { ca_login: login }

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
      return await RequestCache.set(cacheKey, { ca_login: login, ...res.data }, this.module, expried)
    }

    return { ca_login: false }
  }
}

export default new WakaTime()
