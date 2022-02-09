import { AsyncModels } from 'kurimudb'
import { dexieDriverFactory, DexieDriver } from 'kurimudb-driver-dexie'
import migrations from '../migrations'

interface InfoInterface {
  ca_expried_at: number
  ca_updated_at: number
  [other: string]: any
}

class RequestState extends AsyncModels.keyValue<InfoInterface, DexieDriver> {
  constructor() {
    super({
      name: 'request_state',
      driver: dexieDriverFactory,
      db: migrations,
    })
  }

  /**
   * 清理过期数据
   */
  async clean() {
    const now = new Date().getTime()
    return await this.storage.query()
      .filter((item) => {
        return item.ca_expried_at < now || item.ca_expried < now
      })
      .delete()
  }
}

export default new RequestState()
