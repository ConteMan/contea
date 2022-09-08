import type { Table } from 'dexie'
import Dexie from 'dexie'

import type { Config } from './migrations/config'
import { config } from './migrations/config'

export class ModelDexie extends Dexie {
  // added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  config!: Table<Config>

  constructor() {
    super('contea_main')
    this.version(1).stores({
      config,
    })
  }
}

export default new ModelDexie()
