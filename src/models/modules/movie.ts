import type { Table } from 'dexie'
import Base from '../base'
import db from '../db'

export default new class MovieModel extends Base {
  public currentTable: Table

  constructor() {
    super(db.cache)
    this.currentTable = db.cache
  }
}()
