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
    const { currentPage = 1, num = 10 } = paginate
    const res = await InfoModel.query()
      .orderBy('ca_sort_at')
      .filter((item) => {
        if (moduleType.length) {
          if (!moduleType.includes(item.ca_module_type))
            return false
        }
        return item.ca_module === module
      })
      .limit(num).offset((currentPage - 1) * num).reverse()
      .toArray()
    return res
  }

  /**
   * 获取列表
   * @param paginate 分页
   * @returns []
   */
  async list(paginate: Paginate) {
    const sspai = await this.listByModule(paginate, 'sspai')
    return [...sspai]
  }
}

export default new Base()
