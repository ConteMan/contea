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

  async getItem(key: string, index = 'key') {
    return await this.currentTable.where(index).equals(key).first()
  }

  async addItem(key: string, data: any) {
    const dealData = { ...data, key }
    return await this.currentTable.add(dealData)
  }

  async putItem(key: string, data: any) {
    return await this.currentTable.put(key, data)
  }

  async addOrUpdateItem(key: string, data: any) {
    const exist = await this.getItem(key)
    if (exist)
      return await this.putItem(key, data)
    else
      return await this.addItem(key, data)
  }
}

export default Base
