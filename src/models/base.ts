import type { Table } from 'dexie'
import { modules } from '@setting/index'

class Base {
  public currentTable: Table

  constructor(db: Table) {
    this.currentTable = db
  }

  query() {
    return this.currentTable
  }

  async reset() {
    return await this.currentTable.clear()
  }

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

  async getItem(key: string) {
    const res = await this.currentTable.where('key').equals(key).first()
    return res
  }

  async putItem(key: string, data: any) {
    const res = await this.currentTable.put(key, data)
    return res
  }
}

export default Base
