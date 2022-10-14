import type { SettingKeys } from '@setting/index'
import type { Table } from 'dexie'
import { deepMerge } from '@utils/index'
import defaultSetting, { modules } from '@setting/index'
import Alarm from '@services/base/alarm'
import Base from '../base'
import db from '../db'

export default new class ConfigModel extends Base {
  public currentTable: Table

  constructor() {
    super(db.config)
    this.currentTable = db.config
  }

  /**
   * 对象转数组
   * @param data - 对象数据
   */
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

  /**
   * 设置初始化
   * @param module - 设置模块或模式，all 重置初始化，increase 增量初始化（不覆盖已有设置，只增加新字段）
   */
  async init(module: SettingKeys | 'all' | 'increase' = 'all') {
    if (module === 'all') {
      await this.reset()

      const setting = this.objToArr(defaultSetting)
      await this.currentTable.bulkAdd(setting)

      Object.keys(defaultSetting).forEach((item) => {
        Alarm.setAlarm(item)
      })
    }
    else if (module === 'increase') {
      const setting = this.objToArr(defaultSetting)
      setting.forEach(async (item) => {
        const res = await this.addOrIncreaseItem(item.key, item)
        if (res.type === 'add')
          await Alarm.setAlarm(item.key)
      })
    }
    else {
      await this.addOrUpdateItem(module, { ...defaultSetting[module] })
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
   * 获取全部模块配置
   * @param type - 返回数据类型
   * @param keys - 模块名称数组
   */
  async getAll(type: 'array' | 'obj' = 'array', keys = modules): Promise<(any[] | Record<string, any>)> {
    const res = await this.currentTable
      .filter(item => keys.includes(item.key))
      .toArray()

    if (type === 'array')
      return res

    const objRes: Record<string, any> = {}
    res.forEach((item) => {
      objRes[item.key] = item
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
