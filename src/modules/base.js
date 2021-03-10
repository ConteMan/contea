export default class Base {
  static getInstance() {
    console.log(this);
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  setTabId(tabId) {
    this.tabId = tabId;
  }
}
