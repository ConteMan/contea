import { AsyncModels } from 'kurimudb'
import migrations from '../migrations'
import type { DexieDriver } from '~/utils/kurimudb-driver-dexie'
import { dexieDriverFactory } from '~/utils/kurimudb-driver-dexie'

import type { SettingKeys } from '~/setting/defaultSetting'
import defaultSetting from '~/setting/defaultSetting'

import { deepMerge } from '~/utils'
import Alarm from '~/services/base/alarm'

import { useConfigState } from '~/store/config'

type InfoItem = Record<string, any>;

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
      Object.keys(defaultSetting).forEach((item) => {
        Alarm.setAlarm(item)
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

  /**
   * 查询需要执行内容脚本的模块
   */
  async getContentScript() {
    return await this.storage.query()
      .filter((item) => {
        return item.enable && item?.contentScript && item?.contentScript.enable && item?.contentScript.alarm > 0
      })
      .toArray()
  }
}

export default new ConfigState()
