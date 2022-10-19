import type { SettingKeys } from '@setting/index'
import { MODULES } from '@enums/index'
import { station as cmaStation } from './modules/cma'

export type sourceType = 'cma'

class Weather {
  public MODULE: SettingKeys = MODULES.WEATHER

  /**
   * 获取天气数据
   * @param type - 来源， 默认 cma
   * @param params - 参数
   * @param refresh - 是否刷新，默认 false
   */
  async data(type: sourceType = 'cma', params?: any, refresh = false) {
    switch (type) {
      default:
        return await cmaStation(params?.stationId, refresh)
    }
  }
}

export default new Weather()
