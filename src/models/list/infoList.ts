import { AsyncModels } from 'kurimudb'
import { dexieDriverFactory, DexieDriver } from 'kurimudb-driver-dexie'
import MD5 from 'crypto-js/md5'
import migrations from '../migrations'
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

    // eslint-disable-next-line no-console
    console.log(newList)

    const res = await this.storage.bulkInsertOrUpdate(newList)

    return res
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
})()
