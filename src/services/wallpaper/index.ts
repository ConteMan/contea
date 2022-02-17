import _ from 'lodash-es'
import { defHttp } from '~/utils/http/axios'
import { getRandomIntInclusive } from '~/utils'
import RequestCache from '~/services/base/requestCache'
import { alphacodersInfo } from '~/services/wallpaper/model'
class Wallpaper {
  private module = 'wallpaper'

  /**
   * 随机获取壁纸
   */
  async random(source: string[]) {
    if (source) {
      const dealSource = this.dealSource(source)
      const { type, category } = this.randomSource(dealSource)

      if (type === 'alphacoders') {
        const res = await this.alphacoders(category)
        if (res) {
          const pics = res.data
          return pics[getRandomIntInclusive(0, pics.length - 1)]
        }
      }
    }

    return {}
  }

  /**
   * source 数据处理
   */
  dealSource(source: string[]) {
    const res: any = {}
    source.forEach((item) => {
      const itemArray = item.split('-')
      if (!res[itemArray[0]]) res[itemArray[0]] = []
      res[itemArray[0]].push(item)
    })
    return res
  }

  /**
   * 获取随机获取目标
   */
  randomSource(dealSource: any) {
    const sourceTypeKeys = Object.keys(dealSource)
    const sourceTypeKey = sourceTypeKeys[getRandomIntInclusive(0, sourceTypeKeys.length - 1)]
    const selectedType = dealSource[sourceTypeKey]
    const category = selectedType[getRandomIntInclusive(0, selectedType.length - 1)]
    return { type: sourceTypeKey, category }
  }

  /**
   * wall.alphacoders
   * https://wall.alphacoders.com/
   */
  async alphacoders(category = 'alphacoders-anime') {
    const type = 'alphacoders'

    const cacheKey = [this.module, type, category]
    const cacheData = await RequestCache.get(cacheKey)
    if (cacheData)
      return cacheData

    const url = 'https://wall.alphacoders.com'
    const categories = alphacodersInfo.category
    const categoryIndex = _.findIndex(categories, item => item.key === category)
    const urlParams = categories[categoryIndex].url

    const res = await defHttp.get({ url: `${url}${urlParams}` })

    const domParser = new DOMParser()
    const dom = domParser.parseFromString(res.data, 'text/html')

    const picDoms = dom.querySelectorAll('.page_container .center .thumb-container-big')
    const pics: any = []
    picDoms.forEach((item) => {
      const imgUrl = item.querySelector('.img-responsive')?.getAttribute('src')
      const oriImgUrl = imgUrl?.replace('thumbbig-', '')
      const commonImgUrl = imgUrl?.replace('thumbbig-', 'thumb-1920-')
      pics.push({
        imgUrl,
        oriImgUrl,
        commonImgUrl,
      })
    })

    if (pics.length)
      return await RequestCache.set(cacheKey, { data: pics })
    else
      return false
  }
}

export default new Wallpaper()
