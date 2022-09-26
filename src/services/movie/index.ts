import { defHttp } from '@utils/http/axios'
import { getEnable, toDesktop } from '@services/desktop'
import Libvio from './modules/libvio'

type Module = 'libvio' | 'ddrk'

class Movie {
  private module = 'movie'
  private URL_DDRK = 'https://ddys.tv'

  /**
   * 同步 Libvio 到桌面端
   */
  async syncLibvio() {
    try {
      const res = await Libvio.getPage()

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
      await this.syncLibvio()
      await this.syncDdrk()
      return true
    }
    catch (e) {
      return false
    }
  }

  /**
   * 获取列表
   * @param module - 模块
   * @param refresh - 是否刷新数据
   * @param extend - 扩展参数，如具体类型、页码等
   */
  async getList(module: Module = 'libvio', refresh = false, extend: Record<string, any> = {}) {
    try {
      switch (module) {
        case 'libvio':
        default: {
          const { type } = extend
          return await Libvio.getListWithDetail(type ?? undefined, refresh)
        }
      }
    }
    catch (e) {
      return false
    }
  }
}

export default new Movie()
