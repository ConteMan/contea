import { InfoModel } from '@models/index'

interface Paginate {
  currentPage: number
  num: number
  orderBy?: string | Array<string>
  isReverse?: boolean
}

class Base {
  /**
   * 根据模块获取列表
   * @param paginate 分页
   * @param module 模块名称
   * @returns []
   */
  async listByModule(paginate: Paginate, module: 'sspai' = 'sspai', moduleType: string[] = []) {
    try {
      const { currentPage = 1, num = 10 } = paginate
      return await InfoModel.query()
        .orderBy('ca_sort_at')
        .reverse()
        .filter((item) => {
          if (moduleType.length) {
            if (!moduleType.includes(item.ca_module_type))
              return false
          }
          return item.ca_module === module
        })
        .offset((currentPage - 1) * num)
        .limit(num)
        .toArray()
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      return false
    }
  }
}

export default new Base()
