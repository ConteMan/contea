import configState from '~/models/keyValue/configState'
import { defHttp } from '~/utils/http/axios'

class Bgm {
  private module = 'bgm'

  /**
   * 个人信息
   */
  async me() {
    const { token, apiUrl } = await configState.getItem(this.module)

    if (!token)
      return false

    const res = await defHttp.get({
      url: `${apiUrl}/me`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return res.data
  }
}

export default new Bgm()
