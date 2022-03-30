import requestCache from '@services/base/requestCache'
import { defHttp } from '@utils/http/axios'

class Movie {
  private module = 'movie'

  /**
   * Libvio 视频列表
   * @param refresh - 是否刷新
   * @param type - 类型，latest 最新, film 电影
   */
  async libvio(refresh = false, type = 'latest') {
    const site = 'libvio'
    const cacheKey = [this.module, site, type]

    if (!refresh) {
      const cacheData = await requestCache.get(cacheKey)
      if (cacheData)
        return cacheData
    }

    const typeAllSelector = '.stui-pannel .stui-vodlist li .stui-vodlist__box'
    const typeRules: any = {
      latest: {
        url: '',
        allSelector: '.stui-pannel__bd > .stui-vodlist:first-child li .stui-vodlist__box',
      },
      film: {
        url: '/type/1.html',
        allSelector: typeAllSelector,
      },
      tv: {
        url: '/type/2.html',
        allSelector: typeAllSelector,
      },
      anime: {
        url: '/type/4.html',
        allSelector: typeAllSelector,
      },
      kj: {
        url: '/type/15.html',
        allSelector: typeAllSelector,
      },
      om: {
        url: '/type/16.html',
        allSelector: typeAllSelector,
      },
    }

    const url = 'https://www.libvio.com'

    const res = await defHttp.get({
      url: `${url}${typeRules[type].url}`,
    })

    const domParser = new DOMParser()
    const dom = domParser.parseFromString(res.data, 'text/html')

    const list: any = []
    const items = dom.querySelectorAll(typeRules[type].allSelector)
    items.forEach((item) => {
      const title = item.querySelector('a')?.getAttribute('title')
      const url = item.querySelector('a')?.getAttribute('href')
      const pic_url = item.querySelector('a')?.getAttribute('data-original')
      const des = item.querySelector('a span.pic-text')?.innerHTML
      const tag = item.querySelector('a span.pic-tag')?.innerHTML
      list.push({
        title,
        url,
        pic_url,
        des,
        tag,
      })
    })

    if (list.length)
      return await requestCache.set(cacheKey, { data: list })

    return {}
  }

  /**
   * 低端影视 最新视频
   * @returns
   */
  async ddrk() {
    const url = 'https://ddrk.me/'

    const res = await defHttp.get({
      url,
    })

    const domParser = new DOMParser()
    const dom = domParser.parseFromString(res.data, 'text/html')

    const list: any = []
    const items = dom.querySelectorAll('.post-box-list .post-box .post-box-container')
    items.forEach((item) => {
      const title = item.querySelector('.post-box-title a')?.innerHTML
      const url = item.querySelector('.post-box-title a')?.getAttribute('href')
      const pic_url = item.querySelector('.post-box-image')?.getAttribute('style')
      const tagDom = item.querySelectorAll('.post-box-meta a')
      const tags: any = []
      tagDom.forEach((tagItem) => {
        const tagName = tagItem.innerHTML
        const tagUrl = tagItem.getAttribute('href')
        tags.push({
          name: tagName,
          url: tagUrl,
        })
      })
      list.push({
        title,
        url,
        pic_url,
        tags,
      })
    })

    return list
  }
}

export default new Movie()
