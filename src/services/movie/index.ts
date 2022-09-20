import { defHttp } from '@utils/http/axios'
import { getEnable, toDesktop } from '@services/desktop'

class Movie {
  private module = 'movie'
  private URL_LIBVIO = 'https://www.libvio.me'
  private URL_DDRK = 'https://ddys.tv'

  /**
   * 同步 Libvio 到桌面端
   */
  async syncLibvio() {
    try {
      const typeRules: Record<string, any> = {
        latest: {
          url: '',
        },
      }

      const res = await defHttp.get({
        url: `${this.URL_LIBVIO}${typeRules.latest.url}`,
      })

      if (res.data) {
        const enableDesktop = await getEnable()
        if (enableDesktop) {
          await toDesktop('libvio', {
            type: 'list-latest',
            html: res.data,
          })
        }
      }

      return true
    }
    catch (e) {
      return false
    }
  }

  /**
   * 同步 ddrk 到桌面端
   */
  async syncDdrk() {
    try {
      const typeRules: Record<string, any> = {
        latest: {
          url: '',
        },
      }

      const res = await defHttp.get({
        url: `${this.URL_DDRK}${typeRules.latest.url}`,
      })

      if (res.data) {
        const enableDesktop = await getEnable()
        if (enableDesktop) {
          await toDesktop('ddrk', {
            type: 'list-latest',
            html: res.data,
          })
        }
      }

      return true
    }
    catch (e) {
      return false
    }
  }

  /**
   * 同步到桌面端
   */
  async sync() {
    try {
      const DomParser = new DOMParser()
      // eslint-disable-next-line no-console
      console.log('>>> movie >> sync > DOMParser', DomParser)
      // await this.syncLibvio()
      // await this.syncDdrk()
      return true
    }
    catch (e) {
      return false
    }
  }
}

export default new Movie()
