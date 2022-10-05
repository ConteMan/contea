
namespace Store {
  export type MenuItemType = 'module' | 'divider' | 'other'
  export interface MenuItem {
    key: string
    type: MenuItemType
  }
}