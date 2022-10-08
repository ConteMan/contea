import { defHttp } from '@utils/http/axios'

interface Params {
  cid: number
}

class NetEase {
  public URL = 'https://api.sports.163.com'

  /**
   * 获取联赛排行
   * @param cid - 联赛 ID
   */
  async getCompetitionRank(cid: Params['cid'] = 82) {
    try {
      const url = `${this.URL}/base/cs/union/standings?cid=${cid}`
      const res = await defHttp.get({ url })
      if (res.status !== 200)
        return false
      if (res.data.code)
        return false
      if (!res.data.data.items)
        return false
      return res.data.data.items
    }
    catch (e) {
      return false
    }
  }
}
export default new NetEase()
