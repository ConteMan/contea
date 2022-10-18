import { defHttp } from '@utils/http/axios'
import { getEnable, toDesktop } from '@services/desktop'
import { MovieModel } from '@models/index'
import type { MovieModules } from './model'
import Libvio from './modules/libvio'

class Movie {
  private module = 'movie'
  private URL_DDRK = 'https://ddys.tv'

  /**
   * 同步 Libvio 到桌面端
   */
  async syncLibvio() {
    try {
      const res = await Libvio.getList()

      if (res && res.data) {
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
  async getList(module: MovieModules = 'libvio', refresh = false, extend: Record<string, any> = {}) {
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

  /**
   * 从表查询影视数据
   * @param params - 参数
   */
  async movieList(params: {
    type?: string | null
    page?: number
    pageSize?: number
  } = {}) {
    try {
      const { type = null, page = 1, pageSize = 10 } = params
      const res = await MovieModel.query()
        .orderBy('info_at')
        .reverse()
        .filter((item) => {
          return !type ? true : item.source === type
        })
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .toArray()
      return res
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      return false
    }
  }
}

export default new Movie()
