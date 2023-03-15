import type { Table } from 'dexie'
import Base from '../base'
import db from '../db'

export default new class AlarmTaskModel extends Base {
  public currentTable: Table

  constructor() {
    super(db.cache)
    this.currentTable = db.alarmTask
  }

  /**
   * 任务操作
   * @param name - 名称
   * @param action - 动作，set 设置，deal 处理
   */
  async alarmAction(name: string, action: 'set' | 'deal' = 'set') {
    const exist = await this.getItem(name, 'name')
    if (exist) {
      if (action === 'set') {
        return await this.currentTable.update(exist.id, {
          set_at: new Date().getTime(),
          set_times: exist.set_times ? Number(exist.set_times) + 1 : 1,
        })
      }
      else {
        return await this.currentTable.update(exist.id, {
          deal_at: new Date().getTime(),
          deal_times: exist.deal_times ? Number(exist.deal_times) + 1 : 1,
        })
      }
    }

    if (action === 'deal') // 必定先设置再处理
      return false

    return await this.currentTable.add({
      name,
      set_at: new Date().getTime(),
      set_times: 1,
      deal_at: 0,
      deal_times: 0,
    })
  }
}()
