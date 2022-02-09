import { AsyncModels } from 'kurimudb'
import { dexieDriverFactory } from 'kurimudb-driver-dexie'
import migrations from '../migrations'
import defaultSetting from '~/setting/defaultSetting'
import { deepMerge } from '~/utils'
import Alarm from '~/services/base/alarm'

import { useConfigState } from '~/store/config'

class ConfigState extends AsyncModels.keyValue {
  constructor() {
    super({
      name: 'config_state',
      driver: dexieDriverFactory,
      db: migrations,
    })
  }

  // 初始化
  async init(module: 'all'| 'default' | 'v2ex' | 'sspai' | 'weread' | 'bgm' | 'github' | 'weather' | 'zhihu' | 'bilibili' = 'all') {
    if (module === 'all')
      await this.bulkSetItem(defaultSetting)
    else
      await this.setItem(module, defaultSetting[module])

    const configState = useConfigState()
    await configState.setAll()
  }

  /**
   * 合并式设置
   * @param module string - 模块名称
   * @param data {} - 模块内容
   */
  async mergeSet(module: string, data: any) {
    const res = await this.getItem(module)
    const mergeRes = deepMerge(res, data)
    await this.setItem(module, mergeRes)

    // 定时任务
    if (data.enable || data.alarm)
      await Alarm.setAlarm(module)

    const configState = useConfigState()
    await configState.setAll()
  }
}

export default new ConfigState()
