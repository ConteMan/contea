import _ from 'lodash-es'
import { defHttp } from '@utils/http/axios'
import RequestCache from '@services/base/requestCache'
import { ConfigModel } from '@models/index'
import { getEnable, toDesktop } from '@services/desktop'

class One {
  private module = 'one'

  /**
   * 列表数据
   */
  async list(force = false) {
    try {
      const cacheKey = [this.module, 'list']

      if (!force) {
        const cacheData = await RequestCache.get(cacheKey)
        if (cacheData)
          return cacheData
      }

      const { site } = await ConfigModel.getItem(this.module)

      const res = await defHttp.get({ url: site })
      const dealRes = this.domDeal(res.data)

      return await RequestCache.set(cacheKey, { data: dealRes }, undefined, -1)
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.log('>>> Services >> one > list error', error)
      return false
    }
  }

  /**
   * 页面数据处理
   * @param string - 页面 DOM 字符串
   */
  domDeal(domSting: string) {
    const domParser = new DOMParser()
    const dom = domParser.parseFromString(domSting, 'text/html')

    let list: any = {}

    const picTextDom = dom.querySelectorAll('.carousel-inner .item')
    picTextDom.forEach((item: any) => {
      const dateTitleDom = item.querySelector('.fp-one-cita-wrapper .fp-one-titulo-pubdate')
      const vol: string = dateTitleDom?.querySelector('.titulo')?.innerHTML as string
      const date = `${dateTitleDom?.querySelector('.dom').innerHTML.trim()} ${dateTitleDom?.querySelector('.may').innerHTML.trim()}`
      const pic = item.querySelector('a img')?.getAttribute('src')
      const text = item.querySelector('.fp-one-cita a')?.innerHTML
      const picTextLink = item.querySelector('a')?.getAttribute('href')
      list[vol] = {
        vol,
        date,
        pic,
        text,
        picTextLink,
      }
    })

    const todayArticleDom = dom.querySelector('.fp-one-articulo .corriente')
    const todayVol = todayArticleDom?.querySelector('.one-titulo')?.innerHTML.trim() as string
    const todayArticleLink = todayArticleDom?.querySelector('.one-articulo-titulo a')?.getAttribute('href')
    const todayArticleTitle = todayArticleDom?.querySelector('.one-articulo-titulo a')?.innerHTML.trim().match(/\S*/)?.[0]
    const todayArticleAuthor = todayArticleDom?.querySelector('.one-articulo-titulo a small')?.innerHTML.trim().match(/-\s(\S*)/)?.[1]
    list[todayVol].articleLink = todayArticleLink
    list[todayVol].articleTitle = todayArticleTitle
    list[todayVol].articleAuthor = todayArticleAuthor

    const passArticleDom = dom.querySelectorAll('.fp-one-articulo .pasado li')
    passArticleDom.forEach((item: any) => {
      const vol = item.querySelector('.text-muted')?.innerHTML.trim()
      const link = item.querySelector('a')?.getAttribute('href')
      const title = item.querySelector('a')?.innerHTML.trim().match(/\S*/)?.[0]
      const author = item.querySelector('a small')?.innerHTML.trim().match(/-\s(\S*)/)?.[1] ?? ''
      list[vol].articleLink = link
      list[vol].articleTitle = title
      list[vol].articleAuthor = author
    })

    const todayQuestionDom = dom.querySelector('.fp-one-cuestion .corriente')
    const todayQuestionVol = todayQuestionDom?.querySelector('.one-titulo')?.innerHTML.trim() as string
    const todayQuestionLink = todayQuestionDom?.querySelector('.one-cuestion-titulo a')?.getAttribute('href')
    const todayQuestionTitle = todayQuestionDom?.querySelector('.one-cuestion-titulo a')?.innerHTML.trim()
    list[todayQuestionVol].questionLink = todayQuestionLink
    list[todayQuestionVol].questionTitle = todayQuestionTitle

    const passQuestionDom = dom.querySelectorAll('.fp-one-cuestion .pasado li')
    passQuestionDom.forEach((item: any) => {
      const vol = item.querySelector('.text-muted')?.innerHTML.trim()
      const link = item.querySelector('a')?.getAttribute('href')
      const title = item.querySelector('a')?.innerHTML.trim().match(/\S*/)?.[0]
      list[vol].questionLink = link
      list[vol].questionTitle = title
    })

    list = _.orderBy(list, ['vol'], ['desc'])

    return list
  }

  /**
   * 同步数据
   * @param data - 数据
   */
  async sync(data: Record<string, any>) {
    const enableDesktop = await getEnable()
    if (enableDesktop)
      await toDesktop(this.module, data)
  }
}

export default new One()
