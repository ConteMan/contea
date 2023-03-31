import type { FilterEnable } from '@localTypes/common'
import { ConfigModel } from '@models/index'

class Board {
  BOARD_MENU_KEY = 'board_menu'

  /**
   * 获取菜单
   */
  async getMenu() {
    const oriData = await ConfigModel.getItem(this.BOARD_MENU_KEY)
    return oriData.data as Board.ModuleItem[]
  }

  /**
   * 设置菜单
   */
  async setMenu(menu: Partial<Module.BoardMenu>[]) {
    return await ConfigModel.mergeSet(this.BOARD_MENU_KEY, { data: menu })
  }

  /**
   * 模块菜单处理
   * @param modules - 模块数据
   * @param status - 状态，默认筛选开启 true
   */
  filterModuleMenu(modules: Module.BaseConfig[], status: FilterEnable = -1) {
    const menus: Module.BaseConfig['board_menu'] = []
    modules.forEach((item) => {
      if ((status > 0 && !item.enable) || (status === 0 && item.enable)) // 判断模块状态
        return false

      if (typeof item.board_menu === 'undefined' || !item.board_menu.length) // 过滤无效模块
        return false

      item.board_menu.forEach((mItem) => {
        if ((status > 0 && mItem.enable) || (status === 0 && !mItem.enable))
          menus.push({ type: 'module', module: item.key, ...mItem })
        if (status < 0)
          menus.push({ type: 'module', module: item.key, ...mItem })
      })
    })
    return menus
  }

  /**
   * 获取全部模块菜单
   * @param status - 状态，默认筛选开启 true
   */
  async getModuleMenu(status: FilterEnable = -1) {
    const modules = await ConfigModel.getAll() as Module.BaseConfig[]
    return this.filterModuleMenu(modules, status)
  }

  /**
   * 根据模块 key 获取相应模块菜单
   * @param module - 模块 key
   * @param status - 状态，默认筛选开启 true
   */
  async getModuleMenuByModule(module: string, status: FilterEnable = -1) {
    const modules = await ConfigModel.getItem(module) as Module.BaseConfig
    return this.filterModuleMenu([modules], status)
  }

  /**
   * 修改模块菜单
   * @param module - 模块 key
   * @param key - 菜单 key
   * @param data - 修改内容
   */
  async setModuleMenu(module: string, key: string, data: Partial<Module.BoardMenu>) {
    const config = await ConfigModel.getItem(module) as Module.BaseConfig
    if (typeof config.board_menu === 'undefined' || !config.board_menu.length)
      return false
    const newMenu = config.board_menu.map((item) => {
      if (item.key === key) {
        const newItem = { ...item, ...data }
        return newItem
      }

      return item
    })
    await ConfigModel.mergeSet(module, { board_menu: newMenu })
    return true
  }

  /**
   * 移除菜单项
   * @param key - 要移除菜单项的 key
   */
  async removeMenuItem(key: string) {
    const menu = await this.getMenu()
    const newMenu = menu.filter((item, _index, arr) => {
      if (item.key === key) {
        arr[0] = item
        return false
      }
      else {
        return true
      }
    })
    if (menu[0].key === key) { // 找到菜单，处理模块的配置
      if (menu[0].type === 'module')
        await this.setModuleMenu(menu[0].key, key, { enable: false })
    }
    await this.setMenu(newMenu)
    return true
  }

  /**
   * 添加菜单
   * @param item - 菜单项
   */
  async addMenuItem(item: Partial<Module.BoardMenu>) {
    if (item.type && item.type === 'divider') {
      const menu = await this.getMenu()
      await this.setMenu([...menu, item])
    }
    return true
  }

  /**
   * 根据模块更新菜单
   * @param module - 模块 key
   */
  async refreshMenu(module: string) {
    const moduleMenu = await this.getModuleMenuByModule(module)
    const allMenu = await this.getModuleMenu()
    let newMenu: Module.BoardMenu[] = []
    allMenu.forEach((item) => {
      if (item.module === module) {
        const index = moduleMenu.findIndex(mItem => mItem.key === item.key)
        if (index >= 0) {
          moduleMenu.slice(index, 1)
          newMenu.push(moduleMenu[index])
        }
      }
      else {
        newMenu.push(item)
      }
    })
    if (moduleMenu.length)
      newMenu = [...newMenu, ...moduleMenu]

    await this.setMenu(newMenu)

    return newMenu
  }

  /**
   * 初始化菜单
   */
  async initMenu() {
    const moduleMenu = await this.getModuleMenu()
    // eslint-disable-next-line no-console
    console.log(moduleMenu)
    if (moduleMenu)
      await this.setMenu(moduleMenu)
    return true
  }
}

export default new Board()
