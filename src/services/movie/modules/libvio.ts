import MD5 from 'crypto-js/md5'
import { defHttp } from '@utils/http/axios'
import { ConfigModel, MovieModel } from '@models/index'
import RequestCache from '@services/base/requestCache'
import { getRandomIntInclusive, sleep } from '@utils/index'
import type { Movie } from '@models/migrations/movie'

type Types = 'latest' | 'film' | 'tv' | 'anime' | 'kj' | 'om'
interface Rule {
  url: string
  allSelector: string
}
type TypeRule = Record<Types, Rule>
interface Base {
  libvio_id: number
  title: string
  url: string
  pic_url: string
  desc: string
  tag: string
}
type List = Base[]
interface CacheList {
  ca_updated_at: number
  ca_expired_at: number
  data: List
}
interface Detail {
  douban_id: string
  douban_url: string
  detail_str: string
  updated_at: string
  detail_arr: string[]
  [other: string]: number | string | string[]
}
interface CacheDetail {
  ca_updated_at: number
  ca_expired_at: number
  cache_sign?: 'get' | 'set'
  data: Detail
}
type Item = Base & Detail

export default new class Libvio {
  private MODULE = 'movie'
  private MODULE_TYPE = 'libvio'
  private DETAIL_CACHE_EXPIRED = 1800

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
   * 获取 Cookie 字符串
   * @param url - Cookie 相关地址
   */
  async getCookieStr(url: string) {
    const cookies = await browser.cookies.getAll({ url })
    let cookieStr = ''
    if (cookies) {
      cookies.forEach((item) => {
        cookieStr += `${item.name}=${item.value};`
      })
    }
    return cookieStr
  }

  /**
   * 获取页面
   * @param type - 请求类型
   */
  async getPage(type: Types | false = 'latest', url = ''): Promise<false | string> {
    try {
      const { module } = await ConfigModel.getItem(this.MODULE)
      const { site } = module[this.MODULE_TYPE]

      if (!type && !url)
        return false

      const cookieStr = await this.getCookieStr(site)
      const requestUrl = !type ? url : `${site}${this.TYPE_RULES[type].url}`
      const res = await defHttp.get({
        url: requestUrl,
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
        const libvio_id = parseInt(oriUrl.replaceAll(/detail|\.html|\//g, '')) ?? 0
        const pic_url = item.querySelector('a')?.getAttribute('data-original') ?? ''
        const desc = item.querySelector('a span.pic-text')?.innerHTML ?? ''
        const tag = item.querySelector('a span.pic-tag')?.innerHTML ?? ''
        list.push({
          libvio_id,
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
  async getList(type: Types = 'latest', refresh = false): Promise<false | CacheList> {
    try {
      const cacheKey = [this.MODULE, this.MODULE_TYPE, type]
      if (!refresh) {
        const cacheRes = await RequestCache.get(cacheKey)
        if (cacheRes)
          return cacheRes
      }

      const html = await this.getPage(type)
      if (!html)
        return false

      const formatRes = await this.formatPage(html)

      if (!formatRes)
        return false

      return await RequestCache.set(cacheKey, { data: formatRes }, undefined, -1)
    }
    catch (e) {
      return false
    }
  }

  /**
   * 格式化详情页面数据
   * @param html - 页面 HTML 数据
   */
  formatDetailPage(html: string) {
    try {
      const domParser = new DOMParser()
      const dom = domParser.parseFromString(html, 'text/html')

      const douban_url = dom.querySelector('.stui-content .stui-content__detail p a[href*=douban]')?.getAttribute('href') ?? ''
      const douban_id = douban_url ? parseInt(douban_url.replace('https://movie.douban.com/subject/', '').replaceAll('/', '')) : 0

      // 暂时不保存无豆瓣 ID 数据
      if (!douban_id)
        return false

      const details = dom.querySelectorAll('.stui-content .stui-content__detail p.data')
      const detail_str = dom.querySelector('.stui-content .stui-content__detail .desc.detail .detail-content')?.innerHTML ?? ''
      let updated_at = ''
      if (details.length > 0)
        updated_at = `${details[details.length - 1].querySelector('a')?.innerHTML}`
      const detail_arr: string[] = []
      if (details.length > 2) {
        for (let i = 0; i < details.length - 2; i++)
          detail_arr.push(details[i]?.innerHTML)
      }

      const data = {
        douban_id,
        douban_url,
        detail_str,
        updated_at: dayjs(updated_at).isValid() ? updated_at : new Date().getTime(),
        detail_arr,
      }

      return data
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取格式化后的详情数据
   * @param url - 页面地址
   * @param refresh - 是否更新
   */
  async getDetail(url: string, refresh = false): Promise<false | CacheDetail> {
    try {
      const urlId = MD5(url)
      const cacheKey = [this.MODULE, this.MODULE_TYPE, 'item', urlId]
      if (!refresh) {
        const cacheRes = await RequestCache.get(cacheKey)
        if (cacheRes && cacheRes.data.douban_id)
          return { ...cacheRes, cache_sign: true }
      }

      const html = await this.getPage(false, url)
      if (!html)
        return false

      const formatRes = this.formatDetailPage(html)
      if (!formatRes)
        return false

      return await RequestCache.set(cacheKey, { data: formatRes }, undefined, this.DETAIL_CACHE_EXPIRED)
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取带详情的列表
   * @param type - 请求类型
   * @param refresh - 是否刷新数据
   */
  async getListWithDetail(type: Types = 'latest', refresh = false) {
    try {
      const list = await this.getList(type, refresh)
      if (!list)
        return false

      const detailList = []
      const { data } = list
      for (let i = 0; i < data.length; i++) {
        const detail = await this.getDetail(data[i].url)
        if (detail) {
          detailList.push({ ...data[i], ...detail.data })
          if (detail?.cache_sign && detail.cache_sign === 'get')
            await sleep(getRandomIntInclusive(800, 3000))
        }
      }
      await this.save(detailList)
      return detailList
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      return false
    }
  }

  /**
   * 保存数据到 Movie 表
   * @param data - 数据
   */
  async save(data: Item[]) {
    try {
      const formatData: Movie[] = []
      data.forEach((item) => {
        formatData.push({
          douban_id: item.douban_id,
          source: this.MODULE_TYPE,
          info_at: dayjs(item.updated_at).unix(),

          libvio_id: item.libvio_id,
          libvio_data: item,
        })
      })
      // eslint-disable-next-line no-console
      console.log('>>> movie >> libvio > save ', formatData)
      return await MovieModel.bulkSet(formatData)
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      return false
    }
  }
} ()
