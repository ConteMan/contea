import { defHttp } from '@utils/http/axios'
import { ConfigModel } from '@models/index'
import RequestCache from '@services/base/requestCache'

type Types = 'latest' | 'film' | 'tv' | 'anime' | 'kj' | 'om'
interface Rule {
  url: string
  allSelector: string
}
type TypeRule = Record<Types, Rule>
interface ListItem {
  title: string
  url: string
  pic_url: string
  desc: string
  tag: string
}
type List = ListItem[]

export default new class Libvio {
  private MODULE = 'movie'
  private MODULE_TYPE = 'libvio'

  private typeAllSelector = '.stui-pannel .stui-vodlist li .stui-vodlist__box'
  private TYPE_RULES: TypeRule = {
    latest: {
      url: '',
      allSelector: '.stui-pannel__bd > .stui-vodlist:first-child li .stui-vodlist__box',
    },
    film: {
      url: '/type/1.html',
      allSelector: this.typeAllSelector,
    },
    tv: {
      url: '/type/2.html',
      allSelector: this.typeAllSelector,
    },
    anime: {
      url: '/type/4.html',
      allSelector: this.typeAllSelector,
    },
    kj: {
      url: '/type/15.html',
      allSelector: this.typeAllSelector,
    },
    om: {
      url: '/type/16.html',
      allSelector: this.typeAllSelector,
    },
  }

  /**
   * 获取页面
   * @param type - 请求类型
   */
  async getPage(type: Types = 'latest') {
    try {
      const { module } = await ConfigModel.getItem(this.MODULE)
      const { site } = module[this.MODULE_TYPE]

      const cookies = await browser.cookies.getAll({ url: site })
      let cookieStr = ''
      if (cookies) {
        cookies.forEach((item) => {
          cookieStr += `${item.name}=${item.value};`
        })
      }

      const res = await defHttp.get({
        url: `${site}${this.TYPE_RULES[type].url}`,
        withCredentials: true,
        headers: {
          Cookie: cookieStr ?? undefined,
        },
      })

      if (!res.data)
        return false

      return res.data
    }
    catch (e) {
      return false
    }
  }

  /**
   * 格式化页面数据
   * @param html - 页面 HTML 数据
   * @param type - 请求类型
   */
  async formatPage(html: string, type: Types = 'latest') {
    try {
      const { module } = await ConfigModel.getItem(this.MODULE)
      const { site } = module[this.MODULE_TYPE]

      const allSelector = this.TYPE_RULES[type].allSelector

      const domParser = new DOMParser()
      const dom = domParser.parseFromString(html, 'text/html')

      const list: List = []
      const items = dom.querySelectorAll(allSelector)
      items.forEach((item) => {
        const title = item.querySelector('a')?.getAttribute('title') ?? ''
        const oriUrl = item.querySelector('a')?.getAttribute('href') ?? ''
        const url = oriUrl ? `${site}${oriUrl}` : ''
        const pic_url = item.querySelector('a')?.getAttribute('data-original') ?? ''
        const desc = item.querySelector('a span.pic-text')?.innerHTML ?? ''
        const tag = item.querySelector('a span.pic-tag')?.innerHTML ?? ''
        list.push({
          title,
          url,
          pic_url,
          desc,
          tag,
        })
      })

      return list
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取列表数据
   * @param type - 请求类型
   */
  async getList(type: Types = 'latest', refresh = false) {
    try {
      const cacheKey = [this.MODULE, this.MODULE_TYPE, type]
      if (!refresh) {
        const cacheRes = await RequestCache.get(cacheKey)
        if (cacheRes)
          return cacheRes
      }

      const html = await this.getPage(type)
      const formatRes = await this.formatPage(html)

      if (!formatRes)
        return false

      return await RequestCache.set(cacheKey, { data: formatRes })
    }
    catch (e) {
      return []
    }
  }
} ()
