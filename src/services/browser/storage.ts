class Storage {
  /**
   * 使用存储信息
   */
  async managedUse() {
    return await navigator.storage.estimate()
  }
}

export default new Storage()
