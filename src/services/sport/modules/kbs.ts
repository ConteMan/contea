import dayjs from 'dayjs'
import { defHttp } from '@utils/http/axios'

class KBS {
  private kbsApiUrl = 'https://matchweb.sports.qq.com'

  /**
   * 从腾讯体育获取比赛信息
   */
  async matches(columnId: number | string) {
    const index = 0
    const startTime = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    const endTime = dayjs().add(3, 'day').format('YYYY-MM-DD')

    const res = await defHttp.get({
      url: `${this.kbsApiUrl}/matchUnion/list`,
      params: {
        index,
        startTime,
        endTime,
        columnId,
      },
    })

    return res.data.data
  }
}

export default new KBS()
