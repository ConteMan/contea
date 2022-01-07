
class Storage {
  async managedUse() {
    return await navigator.storage.estimate()
  }
}

export default new Storage()
