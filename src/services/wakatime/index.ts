import { defHttp } from '~/utils/http/axios'
import type { SettingKeys } from '~/setting/defaultSetting'
import ConfigState from '~/models/keyValue/configState'
import RequestCache from '~/services/base/requestCache'

class WakaTime {
  private module: SettingKeys = 'wakatime'
  private today = dayjs().format('YYYY-MM-DD')

  /**
   * 登录检测
   * @returns Promise<boolean>
   */
  async loginCheck(): Promise<boolean> {
    const { apiUrl } = await ConfigState.getItem(this.module)

    try {
      const res = await defHttp.get({
        url: `${apiUrl}/users/current?show=has_password%2Cemails`,
      })
      return !!res.data
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
      const expired = startDate !== endDate ? 43200 : 0 // 如果不是查询当日的数据，设置缓存时间为半天
      return await RequestCache.set(cacheKey, { ca_login: login, ...res.data }, this.module, expired)
    }

    return { ca_login: false }
  }
}

export default new WakaTime()
