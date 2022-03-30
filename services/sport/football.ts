import KBS from './kbs'

class Football {
  /**
   * 获取比赛信息
   */
  async matches(columnId: number | string) {
    return await KBS.matches(columnId)
  }
}

export default new Football()
