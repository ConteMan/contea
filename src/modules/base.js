export default class Base {
  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  setTabId(tabId) {
    this.tabId = tabId;
  }
}
