import { AsyncModels } from 'kurimudb'
import migrations from '../migrations'
import { dexieDriverFactory } from '~/utils/kurimudb-driver-dexie'
import { deepMerge } from '~/utils'
import configState from '~/models/keyValue/configState'
import { isBoolean } from '~/utils/is'

class ModuleState extends AsyncModels.keyValue {
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
   * @param expried number | boolean - 过期时间
   */
  async mergeSet(module: string, data: any, expried: number | boolean = true) {
    const now = new Date().getTime()
    data.ca_updated_at = now

    if (expried || expried === 0) {
      if (isBoolean(expried)) {
        const { expried: moduleExpried } = await configState.getItem(module)
        expried = parseInt(moduleExpried) ?? 0
      }
      data.ca_expried_at = now + expried * 1000
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
    if (res?.ca_expried_at && res?.ca_expried_at < now)
      return false

    return res
  }
}

export default new ModuleState()
