import type { Table } from 'dexie'

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

  async getAll(type: 'array' | 'obj' = 'array'): Promise<(any[] | Record<string, any>)> {
    const res = await this.currentTable.toArray()

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

  async addItem(key: string, data: any, index = 'key') {
    const dealData = { ...data, [index]: key }
    return await this.currentTable.add(dealData)
  }

  async putItem(key: string, data: any) {
    const exist = await this.getItem(key)
    if (exist) {
      const dealData = { id: exist.id, ...data }
      return await this.currentTable.put(dealData)
    }
    return false
  }

  async addOrUpdateItem(key: string, data: any, index = 'key') {
    const exist = await this.getItem(key, index)
    if (exist)
      return await this.currentTable.update(exist.id, data)
    else
      return await this.addItem(key, data, index)
  }
}

export default Base
