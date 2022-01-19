import { defHttp } from '~/utils/http/axios'
import ConfigState from '~/models/keyValue/configState'
import ModuleState from '~/models/keyValue/moduleState'

class Jike {
  private module = 'jike'

  /**
   * 个人信息
   */
  async me() {
    const cache = await ModuleState.getValidItem(this.module)
    if (cache)
      return cache

    const { apiUrl } = await ConfigState.getItem(this.module)
    const res = await defHttp.post({
      url: apiUrl,
      data: {
        operationName: 'BasicProfile',
        variables: {},
        query: 'query BasicProfile {\n  profile {\n    distinctId: id\n    ...UserCardFragment\n    __typename\n  }\n}\n\nfragment UserCardFragment on UserInfo {\n  ...TinyUserFragment\n  statsCount {\n    followedCount\n    followingCount\n    __typename\n  }\n  backgroundImage {\n    picUrl\n    __typename\n  }\n  following\n  __typename\n}\n\nfragment TinyUserFragment on UserInfo {\n  avatarImage {\n    thumbnailUrl\n    smallPicUrl\n    picUrl\n    __typename\n  }\n  username\n  screenName\n  briefIntro\n  __typename\n}\n',
      },
    })

    const now = new Date().getTime()
    const { expried } = await ConfigState.getItem(this.module)
    const moduleData = {
      ...res.data.data,
      expried: now + expried * 1000,
    }

    await ModuleState.mergeSet(this.module, moduleData)

    return res.data.data
  }
}

export default new Jike()
