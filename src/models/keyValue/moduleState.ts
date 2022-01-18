import { AsyncModels } from 'kurimudb'
import { dexieDriverFactory } from 'kurimudb-driver-dexie'
import migrations from '../migrations'
import { deepMerge } from '~/utils'

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
   */
  async mergeSet(module: string, data: {}) {
    const res = await this.getItem(module)
    const mergeRes = deepMerge(res, data)
    return await this.setItem(module, mergeRes)
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
    if (res?.expried && res?.expried < now)
      return false

    return res
  }
}

export default new ModuleState()
