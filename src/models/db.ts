import type { Table } from 'dexie'
import Dexie from 'dexie'

import type { Config } from './migrations/config'
import type { Cache } from './migrations/cache'
import type { Info } from './migrations/info'
import type { AlarmTask } from './migrations/alarmTask'
import type { Movie } from './migrations/movie'
import type { FootballTeam } from './migrations/footballTeam'

import { config } from './migrations/config'
import { cache } from './migrations/cache'
import { info } from './migrations/info'
import { alarmTask } from './migrations/alarmTask'
import { movie } from './migrations/movie'
import { footballTeam } from './migrations/footballTeam'

export class ModelDexie extends Dexie {
  // added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  config!: Table<Config>
  cache!: Table<Cache>
  info!: Table<Info>
  alarmTask!: Table<AlarmTask>
  movie!: Table<Movie>
  footballTeam!: Table<FootballTeam>

  constructor() {
    super('contea_main')
    this.version(11).stores({ // !!! 修改表后，记得更新版本
      config,
      cache,
      info,
      alarmTask,
      movie,
      footballTeam,
    })
  }
}

export default new ModelDexie()
