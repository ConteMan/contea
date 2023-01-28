// import { MODULES } from '@enums/index'

class Extension {
  // private module = MODULES.EXTENSION

  /**
   * 获取全部扩展
   */
  async all() {
    return await browser.management.getAll()
  }
}

export default new Extension()
