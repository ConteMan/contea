class Bookmark {
  /**
   * 获取最近的书签
   * @returns []
   */
  async recent(num: number) {
    return await browser.bookmarks.getRecent(num)
  }

  /**
   * 获取层级结构的书签
   * @returns {}
   */
  async tree() {
    return await browser.bookmarks.getTree()
  }
}

export default new Bookmark()
