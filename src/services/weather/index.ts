import type { ModuleKey } from '@config/index'
import { station as cmaStation } from './modules/cma'
import { MODULES } from '~/config/index'

class Weather {
  public module: ModuleKey = MODULES.WEATHER

  /**
   * 获取天气数据
   * @param type - 来源， 默认 cma
   * @param params - 参数
   * @param refresh - 是否刷新，默认 false
   */
  async data(type: WeatherType.sourceType = 'cma', params?: any, refresh = false) {
    switch (type) {
      default:
        return await cmaStation(params?.stationId, refresh)
    }
  }
}

export default new Weather()
