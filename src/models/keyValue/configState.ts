import { AsyncModels } from 'kurimudb'
import { dexieDriverFactory } from 'kurimudb-driver-dexie'
import migrations from '../migrations'
import defaultSetting from '~/setting/defaultSetting'
import { deepMerge } from '~/utils'
import Alarm from '~/services/base/alarm'

import type { BaseModule } from '~/services/base/model'

class ConfigState extends AsyncModels.keyValue {
  constructor() {
    super({
      name: 'config_state',
      driver: dexieDriverFactory,
      db: migrations,
    })
  }

  // 初始化
  async init() {
    await this.bulkSetItem(defaultSetting)
  }

  // 合并式设置
  async mergeSet(module: string, data: BaseModule) {
    const res = await this.getItem(module)
    const mergeRes = deepMerge(res, data)
    // eslint-disable-next-line no-console
    console.log({ mergeRes })
    await this.setItem(module, mergeRes)
    if (data.enable || data.alarm)
      await Alarm.setAlarm(module)
  }
}

export default new ConfigState()
