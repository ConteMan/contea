namespace Board {
  export type ModuleItem = Store.MenuItem & {
    component?: string
    title?: string
    config?: Record<string, any>
  }
  
  export type SpecialModule = Record<string, {
    key: string
    configModule: string
    configKey: string
    type: 'module'
    title: string
  }>
}
