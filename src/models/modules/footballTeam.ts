import type { Table } from 'dexie'
import Base from '../base'
import db from '../db'

export default new class FootballTeamModel extends Base {
  public currentTable: Table

  constructor() {
    super(db.footballTeam)
    this.currentTable = db.footballTeam
  }
}()
