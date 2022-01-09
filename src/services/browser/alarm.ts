class Alarm {
  /**
   * 获取全部定时任务信息
   */
  async all() {
    return await browser.alarms.getAll()
  }
}

export default new Alarm()
