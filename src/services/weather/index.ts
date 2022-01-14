import { defHttp } from '~/utils/http/axios'

class Weather {
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
    const res = await defHttp.get({
      url: 'https://weather.cma.cn/api/weather/view',
      params: {
        stationId,
      },
    })

    return res.data.data
  }
}

export default new Weather()
