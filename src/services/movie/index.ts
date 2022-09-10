import { defHttp } from '@utils/http/axios'
import { toDesktop } from '@services/desktop'

class Movie {
  private module = 'movie'

  /**
   * 同步到桌面端
   */
  async sync() {
    try {
      await this.syncLibvio()
      await this.syncDdrk()
      return true
    }
    catch (e) {
      return false
    }
  }

  /**
   * 同步 Libvio 到桌面端
   */
  async syncLibvio() {
    try {
      const typeRules: any = {
        latest: {
          url: '',
        },
        film: {
          url: '/type/1.html',
        },
        tv: {
          url: '/type/2.html',
        },
        anime: {
          url: '/type/4.html',
        },
        kj: {
          url: '/type/15.html',
        },
        om: {
          url: '/type/16.html',
        },
      }

      const url = 'https://www.libvio.me'

      const res = await defHttp.get({
        url: `${url}${typeRules.latest.url}`,
      })

      if (res.data) {
        await toDesktop('libvio', {
          type: 'list-latest',
          html: res.data,
        })
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
      const typeRules: any = {
        latest: {
          url: '',
        },
      }

      const url = 'https://ddys.tv'

      const res = await defHttp.get({
        url: `${url}${typeRules.latest.url}`,
      })

      if (res.data) {
        await toDesktop('ddrk', {
          type: 'list-latest',
          html: res.data,
        })
      }

      return true
    }
    catch (e) {
      return false
    }
  }
}

export default new Movie()
