import type { Table } from 'dexie'
import type { Movie } from '@models/migrations/movie'
import Base from '../base'
import db from '../db'

export default new class MovieModel extends Base {
  public currentTable: Table

  constructor() {
    super(db.movie)
    this.currentTable = db.movie
  }

  /**
   * 批量添加或更新
   * @param data - 数据
   */
  async bulkSet(data: Movie[]) {
    let addCount = 0
    let updateCount = 0
    const now = new Date().getTime()
    for (let i = 0; i < data.length; i++) {
      const currentItem = data[i]
      if (!currentItem?.updated_at)
        currentItem.updated_at = now
      if (!currentItem.info_at)
        currentItem.info_at = now
      const exist = await this.currentTable.where('douban_id').equals(currentItem.douban_id).first()
      if (exist) {
        await this.currentTable.put({ id: exist.id, ...currentItem })
        updateCount++
      }
      else {
        if (!currentItem?.created_at)
          currentItem.created_at = now
        if (!currentItem?.status)
          currentItem.status = 1 // 正常状态
        await this.currentTable.add(currentItem)
        addCount++
      }
    }

    return { add: addCount, update: updateCount }
  }
}()
