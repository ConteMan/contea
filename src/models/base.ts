import type { Table } from 'dexie'

class Base {
  public currentTable: Table

  constructor(db: Table) {
    this.currentTable = db
  }

  /**
   * 使用 dexie 查询
   */
  query() {
    return this.currentTable
  }

  /**
   * 重置数据
   */
  async reset() {
    return await this.currentTable.clear()
  }

  /**
   * 获取全部数据
   * @param type - 返回数据类型， array 数组，obj 对象
   */
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

  /**
   * 根据键获取内容
   * @param key - 键值
   * @param index - 键对应字段
   */
  async getItem(key: string | number, index = 'key') {
    return await this.currentTable.where(index).equals(key).first()
  }

  /**
   * 添加数据
   * @param key - 键值
   * @param data - 数据
   * @param index - 键对应字段
   */
  async addItem(key: string | number, data: any, index = 'key') {
    const dealData = { ...data, [index]: key }
    return await this.currentTable.add(dealData)
  }

  /**
   * 更新数据
   * @param key - 键值
   * @param data - 数据
   * @param index - 键对应字段
   */
  async putItem(key: string | number, data: any, index = 'key') {
    const exist = await this.getItem(key, index)
    if (exist) {
      const dealData = { id: exist.id, ...data }
      return await this.currentTable.put(dealData)
    }
    return false
  }

  /**
   * 全量，新增或更新数据
   * @param key - 键值
   * @param data - 数据
   * @param index - 键对应字段
   */
  async addOrUpdateItem(key: string | number, data: any, index = 'key') {
    const exist = await this.getItem(key, index)
    if (exist)
      return await this.currentTable.update(exist.id, { ...exist, ...data })
    else
      return await this.addItem(key, data, index)
  }

  /**
   * 增量，新增整体 或 增加新字段数据（如果字段已存在，则不更新）
   * @param key - 键值
   * @param data - 数据
   * @param index - 键对应字段
   */
  async addOrIncreaseItem(key: string | number, data: any, index = 'key') {
    const exist = await this.getItem(key, index)
    if (exist) {
      const res = await this.currentTable.update(exist.id, { ...data, ...exist })
      return {
        type: 'increase',
        res,
      }
    }
    else {
      const res = await this.addItem(key, data, index)
      return {
        type: 'add',
        res,
      }
    }
  }

  /**
   * 判断是否存在数据
   * @param key - 键值
   * @param index - 键对应字段
   */
  async has(key: string | number, index = 'key') {
    return !!await this.getItem(key, index)
  }
}

export default Base
