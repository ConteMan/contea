import type { Table } from 'dexie'
import Dexie from 'dexie'

import type { Config } from './migrations/config'
import type { Cache } from './migrations/cache'
import type { Info } from './migrations/info'

import { config } from './migrations/config'
import { cache } from './migrations/cache'
import { info } from './migrations/info'

export class ModelDexie extends Dexie {
  // added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  config!: Table<Config>
  cache!: Table<Cache>
  info!: Table<Info>

  constructor() {
    super('contea_main')
    this.version(1).stores({
      config,
      cache,
      info,
    })
  }
}

export default new ModelDexie()
