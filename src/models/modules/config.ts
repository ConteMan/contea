import type { Table } from 'dexie'
import { deepMerge } from '@utils/index'
import Alarm from '@services/base/alarm'
import Board from '@services/board'
import type { Config } from '@models/migrations/config'
import type { ModuleKey } from '@config/index'
import { MODULE_DEFAULT_ARRAY, MODULE_DEFAULT_KEYS, MODULE_DEFAULT_MAP } from '@config/index'
import db from '../db'
import Base from '../base'

type ConfigInitType = ModuleKey | 'all' | 'increase'

export default new class ConfigModel extends Base {
  public currentTable: Table<Config>

  constructor() {
    super(db.config)
    this.currentTable = db.config
  }

  /**
   * 设置初始化
   * #1.1
   * @param module - 设置模块或模式；all 重置初始化，increase 增量初始化（不覆盖已有设置，只增加新字段）
   */
  async init(module: ConfigInitType = 'all') {
    if (module === 'all') {
      await this.reset()

      await this.currentTable.bulkAdd(MODULE_DEFAULT_ARRAY)

      MODULE_DEFAULT_KEYS.forEach((item) => {
        void Alarm.setAlarm(item)
      })
    }
    else if (module === 'increase') {
      MODULE_DEFAULT_ARRAY.forEach(async (item) => {
        const res = await this.addOrIncreaseItem(item.key, item)
        if (res.type === 'add')
          await Alarm.setAlarm(item.key)
      })
    }
    else {
      if (typeof MODULE_DEFAULT_MAP[module] === 'undefined')
        return false
      await this.addOrUpdateItem(module, MODULE_DEFAULT_MAP[module])
      await Alarm.setAlarm(module)
    }
    if (module === 'all')
      await Board.initMenu()
    return true
  }

  /**
   * 合并式设置
   * @param module string - 模块名称
   * @param data {} - 模块内容
   * @param deep number - 合并深度，0 完全
   */
  async mergeSet(module: string, data: Record<string, any>, deep = 0) {
    const res = await this.currentTable.get({ key: module })
    if (res) {
      const mergeRes = deepMerge(res, data, deep)
      await this.currentTable.put(mergeRes)
    }
    else {
      await this.currentTable.add({ key: module, ...data })
    }

    // 定时任务
    if (data?.enable || data?.alarm)
      await Alarm.setAlarm(module)

    return true
  }

  /**
   * 获取全部模块配置
   * @param type - 返回数据类型
   * @param keys - 模块名称数组
   */
  async getAll(type: 'array' | 'obj' = 'array', keys: string[] = MODULE_DEFAULT_KEYS) {
    const res = await this.currentTable
      .filter(item => keys.includes(item.key))
      .toArray()

    if (type === 'array')
      return res

    const objRes = {} as Record<ModuleKey, Config>
    res.forEach((item) => {
      objRes[item.key as ModuleKey] = item
    })
    return objRes
  }

  /**
   * 查询需要执行内容脚本的模块
   */
  async getContentScript() {
    return await this.currentTable.filter((item) => {
      return item.enable && item?.contentScript && item?.contentScript.enable && item?.contentScript.alarm > 0
    }).toArray()
  }
}()
