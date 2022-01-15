import { AsyncModels } from 'kurimudb'
import { dexieDriverFactory } from 'kurimudb-driver-dexie'
import migrations from '../migrations'

class RequestState extends AsyncModels.keyValue {
  constructor() {
    super({
      name: 'request_state',
      driver: dexieDriverFactory,
      db: migrations,
    })
  }
}

export default new RequestState()
