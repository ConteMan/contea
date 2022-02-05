import { defHttp } from '~/utils/http/axios'
import { getRandomIntInclusive } from '~/utils'
import RequestCache from '~/services/base/requestCache'

class Wallpaper {
  private module = 'wallpaper'

  /**
   * 随机获取壁纸
   */
  async random() {
    const res = await this.alphacoders()
    if (res) {
      const pics = res.data
      return pics[getRandomIntInclusive(0, pics.length - 1)]
    }

    return {}
  }

  /**
   * wall.alphacoders
   * https://wall.alphacoders.com/
   */
  async alphacoders() {
    const type = 'alphacoders'

    const cacheKey = [this.module, type]
    const cacheData = await RequestCache.get(cacheKey)
    if (cacheData)
      return cacheData

    const url = 'https://wall.alphacoders.com'

    const res = await defHttp.get({ url: `${url}/popular.php` })

    const domParser = new DOMParser()
    const dom = domParser.parseFromString(res.data, 'text/html')

    const picDoms = dom.querySelectorAll('.page_container .center .thumb-container-big')
    const pics: any = []
    picDoms.forEach((item) => {
      const imgUrl = item.querySelector('.img-responsive')?.getAttribute('src')
      const oriImgUrl = imgUrl?.replace('thumbbig-', '')
      pics.push({
        imgUrl,
        oriImgUrl,
      })
    })

    if (pics.length)
      return await RequestCache.set(cacheKey, { data: pics })
    else
      return false
  }
}

export default new Wallpaper()
