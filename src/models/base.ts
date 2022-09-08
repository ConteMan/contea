import type { Table } from 'dexie'

class Base {
  public currentTable: Table

  constructor(db: Table) {
    this.currentTable = db
  }

  async reset() {
    return await this.currentTable.clear()
  }

  async getAll(type: 'array' | 'obj' = 'array') {
    const res = await this.currentTable.toArray()

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
}

export default Base
