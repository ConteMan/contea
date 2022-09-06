import { defHttp } from '@utils/http/axios'

class Douban {
  async test() {
    const url = 'https://m.douban.com/rexxar/api/v2/user/51883921?ck=3mzt&for_mobile=1'
    return await defHttp.get({ url })
  }
}

export default new Douban()
