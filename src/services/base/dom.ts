import { defHttp } from '@utils/http/axios'

export default new class DomDeal {
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
  * @param url - 请求类型
  */
  async getPage(url = '', header: any = {}): Promise<false | string> {
    try {
      const cookieStr = await this.getCookieStr(url)
      const defaultHeader = {
        Cookie: cookieStr ?? undefined,
      }
      const headers = { ...defaultHeader, ...header }
      const res = await defHttp.get({
        url,
        withCredentials: true,
        headers,
      })

      if (!res.data)
        return false

      return res.data
    }
    catch (e) {
      return false
    }
  }
}()
