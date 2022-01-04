import dayjs from 'dayjs'
import { defHttp } from '~/utils/http/axios'

class WakaTime {
  private apiUrl
  public constructor() {
    this.apiUrl = 'https://wakatime.com/api/v1'
  }

  /**
   * 获取每日汇总数据
   */
  async daySummary() {
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

    return res.data
  }
}

export default new WakaTime()
