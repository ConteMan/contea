import type { Cookies } from 'webextension-polyfill'

class Cookie {
  async getAll(detail: Cookies.GetAllDetailsType): Promise<Cookies.Cookie[]> {
    return await browser.cookies.getAll(detail)
  }
}

export default new Cookie()
