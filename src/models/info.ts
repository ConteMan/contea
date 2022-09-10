import type { Table } from 'dexie'
import MD5 from 'crypto-js/md5'
import Base from './base'
import db from './migration'

interface InfoItem {
  ca_module: string
  ca_module_type: string
  [other: string]: any
}
type InfoList = InfoItem []

export default new class InfoModel extends Base {
  public currentTable: Table

  constructor() {
    super(db.cache)
    this.currentTable = db.info
  }

  // 生成唯一标识
  slug(item: InfoItem, keys: string[]) {
    let slug = `${item.ca_module}-`
    let keyStr = ''

    keys.forEach((key) => {
      keyStr += String(item[key])
    })
    slug += MD5(keyStr)

    return slug
  }

  // 按模块批量插入
  async bulkSetItemByModule(list: InfoList, keys: string[]) {
    let addCount = 0
    let updateCount = 0
    for (let i = 0; i < list.length; i++) {
      const slug = this.slug(list[i], keys)
      const currentItem = { ca_slug: slug, ...list[i] }
      const exist = await this.currentTable.where('ca_slug').equals(slug).first()
      if (exist) {
        await this.currentTable.put({ id: exist.id, ...currentItem })
        updateCount++
      }
      else {
        await this.currentTable.add(currentItem)
        addCount++
      }
    }

    return { add: addCount, update: updateCount }
  }

  /**
   * 根据模块、模块类型删除
   * @param module string - 模块名称
   * @param moduleType string[] - 模块类型数组
   * @returns number - 删除的数量
   */
  async deleteByModule(module: string, moduleType: string[]) {
    return await this.currentTable
      .filter((item) => {
        if (moduleType.length) {
          if (!moduleType.includes(item.ca_module_type))
            return false
        }
        return item.ca_module === module
      })
      .delete()
  }
}()
