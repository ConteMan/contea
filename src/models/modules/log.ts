import type { Table } from 'dexie'
import type { LOG_TYPES } from '@enums/index'
import dayjs from 'dayjs'
import Base from '../base'
import db from '../db'

export default new class LogModel extends Base {
  public currentTable: Table

  constructor() {
    super(db.log)
    this.currentTable = db.log
  }

  async record(type: LOG_TYPES, data: Record<string, any>) {
    const dealData = { ...data, type, add_at: dayjs().unix() }
    return await this.currentTable.add(dealData)
  }
}()
