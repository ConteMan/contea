import { SyncModels } from 'kurimudb'
import { localStorageDriverFactory } from 'kurimudb-driver-localstorage'

class StoreState extends SyncModels.keyValue {
  constructor() {
    super({
      name: 'store_state',
      driver: localStorageDriverFactory,
    })
  }
}

export default new StoreState()
