import { AsyncModels } from 'kurimudb'
import { dexieDriverFactory } from 'kurimudb-driver-dexie'
import migrations from '../migrations'
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
      data.ca_expried = now + expried * 1000
    }

    // eslint-disable-next-line no-console
    console.log({ moduleState: 'mergeSet', module, expried, data })

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
    if (res?.ca_expried && res?.ca_expried < now)
      return false

    return res
  }
}

export default new ModuleState()
