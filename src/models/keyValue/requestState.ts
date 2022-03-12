import { AsyncModels } from 'kurimudb'
import migrations from '../migrations'
import type { DexieDriver } from '~/utils/kurimudb-driver-dexie'
import { dexieDriverFactory } from '~/utils/kurimudb-driver-dexie'

interface InfoInterface {
  ca_expired_at: number
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
        return item.ca_expired_at < now || item.ca_expired < now
      })
      .delete()
  }
}

export default new RequestState()
