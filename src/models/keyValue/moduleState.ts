import { AsyncModels } from 'kurimudb'
import migrations from '../migrations'
import type { DexieDriver } from '~/utils/kurimudb-driver-dexie'
import { dexieDriverFactory } from '~/utils/kurimudb-driver-dexie'
import { deepMerge } from '~/utils'
import configState from '~/models/keyValue/configState'
import { isBoolean } from '~/utils/is'

type Item = Record<string, any>

class ModuleState extends AsyncModels.keyValue<Item, DexieDriver> {
  constructor() {
    super({
      name: 'module_state',
      driver: dexieDriverFactory,
      db: migrations,
    })
  }

  /**
   * 合并式设置
   * @param module string - 模块名称
   * @param data {} - 模块内容
   * @param expired number | boolean - 过期时间
   */
  async mergeSet(module: string, data: any, expired: number | boolean = true) {
    const now = new Date().getTime()
    data.ca_updated_at = now

    if (expired || expired === 0) {
      if (isBoolean(expired)) {
        const { expired: moduleExpired } = await configState.getItem(module)
        expired = parseInt(moduleExpired) ?? 0
      }
      data.ca_expired_at = now + expired * 1000
    }

    const res = await this.getItem(module)
    const mergeRes = deepMerge(res, data)
    await this.setItem(module, mergeRes)
    return mergeRes
  }

  /**
   * 获取有效值
   * @param module string - 模块名称
   */
  async getValidItem(module: string) {
    const res = await this.getItem(module)
    if (!res)
      return false

    const now = new Date().getTime()
    if (res?.ca_expired_at && res?.ca_expired_at < now)
      return false

    return res
  }
}

export default new ModuleState()
