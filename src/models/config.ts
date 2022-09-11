import { deepMerge } from '@utils/index'

import type { SettingKeys } from '@setting/index'
import type { Table } from 'dexie'
import defaultSetting from '@setting/index'
import Alarm from '@services/base/alarm'
import Base from './base'
import db from './migration'

export default new class ConfigModel extends Base {
  public currentTable: Table

  constructor() {
    super(db.config)
    this.currentTable = db.config
  }

  // 对象转数组
  objToArr(data: Record<string, any>) {
    const keys = Object.keys(data)
    if (!keys.length)
      return []

    const array = []
    for (let i = 0; i < keys.length; i++) {
      const item = { ...data[keys[i]] }
      array.push(item)
    }

    return array
  }

  // 初始化
  async init(module: SettingKeys | 'all' = 'all') {
    if (module === 'all') {
      await this.reset()

      const setting = this.objToArr(defaultSetting)
      await this.currentTable.bulkPut(setting)

      Object.keys(defaultSetting).forEach((item) => {
        Alarm.setAlarm(item)
      })
    }
    else {
      await this.currentTable.put({ ...defaultSetting[module] })
      await Alarm.setAlarm(module)
    }
  }

  /**
   * 合并式设置
   * @param module string - 模块名称
   * @param data {} - 模块内容
   */
  async mergeSet(module: string, data: Record<string, any>) {
    const res = await this.currentTable.get({ key: module })
    if (res) {
      const mergeRes = deepMerge(res, data)
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
   * 查询需要执行内容脚本的模块
   */
  async getContentScript() {
    return await this.currentTable.filter((item) => {
      return item.enable && item?.contentScript && item?.contentScript.enable && item?.contentScript.alarm > 0
    }).toArray()
  }
}()
