import { AsyncModels } from 'kurimudb'
import MD5 from 'crypto-js/md5'
import migrations from '../migrations'
import type { DexieDriver } from '~/utils/kurimudb-driver-dexie'
import { dexieDriverFactory } from '~/utils/kurimudb-driver-dexie'
import type { InfoItem, InfoList } from '~/services/v2ex/model'

interface InfoInterface {
  module: string
  module_type: string
  [other: string]: any
}

export default new (class List extends AsyncModels.collection<InfoInterface, DexieDriver> {
  constructor() {
    super({
      name: 'info_list',
      driver: dexieDriverFactory,
      db: migrations,
    })
  }

  // 按模块批量插入
  async bulkSetItemByModule(list: InfoList, keys: string[]) {
    const newList: Record<string, any> = {}
    list.forEach((item) => {
      const slug = this.slug(item, keys)
      newList[slug] = { ca_slug: slug, ...item }
    })

    return await this.storage.bulkInsertOrUpdate(newList)
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

  /**
   * 根据模块、模块类型删除
   * @param module string - 模块名称
   * @param moduleType string[] - 模块类型数组
   * @returns number - 删除的数量
   */
  async deleteByModule(module: string, moduleType: string[]) {
    return await this.storage.query()
      .filter((item) => {
        if (moduleType.length) {
          if (!moduleType.includes(item.ca_module_type))
            return false
        }
        return item.ca_module === module
      })
      .delete()
  }
})()
