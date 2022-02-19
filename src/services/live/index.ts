import huya from './huya'

class Live {
  // private module = 'live'

  async following(refresh = false) {
    return huya.following(refresh)
  }
}

export default new Live()
