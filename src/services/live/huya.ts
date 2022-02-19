import { defHttp } from '~/utils/http/axios'
import requestCache from '~/services/base/requestCache'

class Huya {
  private module = 'huya'

  /**
   * 虎牙直播
   * @param refresh - 是否刷新
   * @param type - 类型，latest 最新, film 电影
   */
  async following(refresh = false) {
    const type = 'following'
    const cacheKey = [this.module, type]

    if (!refresh) {
      const cacheData = await requestCache.get(cacheKey)
      if (cacheData)
        return cacheData
    }

    const url = 'https://i.huya.com'

    const res = await defHttp.get({
      url: `${url}/index.php?m=Subscribe`,
    })

    const domParser = new DOMParser()
    const dom = domParser.parseFromString(res.data, 'text/html')

    const list: any = []
    const items = dom.querySelectorAll('#subscribeCont ul li')
    items.forEach((item) => {
      const url = item.getAttribute('data-link')
      const status = item.querySelector('span.live_icon')?.innerHTML
      const imgUrl = item.querySelector('.img_wrap img')?.getAttribute('src')
      const name = item.querySelector('.text_wrap .p_1')?.innerHTML
      const title = item.querySelector('.text_wrap .p_2')?.innerHTML
      const game = item.querySelectorAll('.text_wrap .p_3 span')?.[1]?.innerHTML
      const follower = (item.querySelector('.text_wrap .p_3 .sub_num')?.innerHTML)?.match(/(\d+\.\d*.*)/)?.[0]
      list.push({
        url,
        status,
        imgUrl,
        name,
        title,
        game,
        follower,
      })
    })

    if (list.length)
      return await requestCache.set(cacheKey, { data: list })

    return {}
  }
}

export default new Huya()
