import _ from 'lodash-es'
import { defHttp } from '@utils/http/axios'
import { getRandomIntInclusive } from '@utils/index'
import RequestCache from '@services/base/requestCache'
import { alphacodersInfo, bing } from '@services/wallpaper/model'

class Wallpaper {
  private module = 'wallpaper'

  /**
   * 获取随机壁纸列表
   * @param source - 壁纸来源数组
   */
  async randomList(source: string[]) {
    try {
      if (!source || !source.length)
        return []

      const dealSource = this.dealSource(source)
      const { type, category } = this.randomSource(dealSource)

      // eslint-disable-next-line no-console
      console.log('>>> Services >> wallpaper > randomList', type, category)

      if (type === 'alphacoders') {
        const res = await this.alphacoders(category)
        return res?.data ?? []
      }

      if (type === 'bing') {
        const res = await this.bing(category)
        return res?.data ?? []
      }

      return []
    }
    catch (e) {
      return []
    }
  }

  /**
   * 获取单张随机壁纸
   * @param source - 壁纸来源数组
   */
  async random(source: string[]) {
    try {
      if (!source || !source.length)
        return {}
      const randomList = await this.randomList(source)

      // eslint-disable-next-line no-console
      console.log('>>> Services >> wallpaper > random', randomList)

      if (!randomList.length)
        return {}
      return randomList[getRandomIntInclusive(0, randomList.length - 1)]
    }
    catch (e) {
      return {}
    }
  }

  /**
   * source 数据处理
   * @param source - 壁纸来源数组
   */
  dealSource(source: string[]) {
    const res: any = {}
    source.forEach((item) => {
      const itemArray = item.split('-')
      if (!res[itemArray[0]])
        res[itemArray[0]] = []
      res[itemArray[0]].push(item)
    })
    return res
  }

  /**
   * 获取随机获取目标
   * @param source - 壁纸来源对象
   */
  randomSource(sources: any) {
    const sourceTypeKeys = Object.keys(sources)
    const sourceTypeKey = sourceTypeKeys[getRandomIntInclusive(0, sourceTypeKeys.length - 1)]
    const selectedType = sources[sourceTypeKey]
    const category = selectedType[getRandomIntInclusive(0, selectedType.length - 1)]
    return { type: sourceTypeKey, category }
  }

  /**
   * wall.alphacoders
   * https://wall.alphacoders.com/
   * @param category - 类别
   */
  async alphacoders(category = 'alphacoders-anime') {
    try {
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

      const picDoms = dom.querySelectorAll('#page_container .center .thumb-container-big .img-responsive')
      const pics: any = []
      picDoms.forEach((item) => {
        const imgUrl = item.getAttribute('src')
        const oriImgUrl = imgUrl?.replace('thumbbig-', '')
        const commonImgUrl = imgUrl?.replace('thumbbig-', 'thumb-1920-')
        pics.push({
          imgUrl,
          oriImgUrl,
          commonImgUrl,
          url: commonImgUrl,
        })
      })

      if (pics.length)
        return await RequestCache.set(cacheKey, { data: pics })
      else
        return false
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log('>>> Services >> wallpaper > alphacoders error', e)
      return false
    }
  }

  /**
   * 必应壁纸
   * @param category - 类别
   */
  async bing(category = 'bing-week') {
    try {
      const type = 'bing'

      const cacheKey = [this.module, type, category]
      const cacheData = await RequestCache.get(cacheKey)
      if (cacheData)
        return cacheData

      const baseUrl = 'https://cn.bing.com'
      const categories = bing.category
      const categoryIndex = _.findIndex(categories, item => item.key === category)
      const url = categories[categoryIndex].url
      const res = await defHttp.get({ url })

      if (res.data.images) {
        const pics: any = []
        res.data.images.forEach((item: any) => {
          pics.push({
            ...item,
            url: `${baseUrl}${item.url}`,
          })
        })
        return await RequestCache.set(cacheKey, { data: pics })
      }
      else {
        return false
      }
    }
    catch (e) {
      return false
    }
  }
}

export default new Wallpaper()
