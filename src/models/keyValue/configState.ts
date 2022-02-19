import { AsyncModels } from 'kurimudb'
import migrations from '../migrations'
import { dexieDriverFactory, DexieDriver } from '~/utils/kurimudb-driver-dexie'

import type { SettingKeys } from '~/setting/defaultSetting'
import defaultSetting from '~/setting/defaultSetting'

import { deepMerge } from '~/utils'
import Alarm from '~/services/base/alarm'

import { useConfigState } from '~/store/config'

interface InfoItem {
  [other: string]: any
}

class ConfigState extends AsyncModels.keyValue<InfoItem, DexieDriver> {
  constructor() {
    super({
      name: 'config_state',
      driver: dexieDriverFactory,
      db: migrations,
    })
  }

  // 初始化
  async init(module: SettingKeys | 'all' = 'all') {
    if (module === 'all') {
      await this.bulkSetItem(defaultSetting)
      Object.keys(defaultSetting).forEach(async(item) => {
        await Alarm.setAlarm(item)
      })
    }
    else {
      await this.setItem(module, defaultSetting[module])
      await Alarm.setAlarm(module)
    }
  }

  /**
   * 合并式设置
   * @param module string - 模块名称
   * @param data {} - 模块内容
   */
  async mergeSet(module: SettingKeys, data: any) {
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
