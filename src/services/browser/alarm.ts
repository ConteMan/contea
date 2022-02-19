class Alarm {
  /**
   * 获取全部定时任务信息
   */
  async all() {
    return await browser.alarms.getAll()
  }

  /**
   * 清理定时任务
   */
  async clear(name: string) {
    return await browser.alarms.clear(name)
  }
}

export default new Alarm()
