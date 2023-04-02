namespace Module {
  export interface BoardMenu {
    key: string // 唯一标识，对应组件文件名小写
    name: string // 名称
    enable?: boolean // 开关
    sort?: number // 排序，数字越小越考前
    alias?: string //别名，如果别名不为空，优先显示别名
    type?: string
    [others: string]: any
  }

  export interface Cron { // 计划任务
    key: string // 唯一标识
    name: string // 名称
    enable?: boolean // 开关
    value?: number | string // 分钟 或 crontab 写法
  }

  export interface BaseConfig {
    enable: boolean // 模块开关；关闭开关，则关闭所有涉及模块功能
    key: string // 模块代码
    name: string // 模块名称

    board_menu?: BoardMenu[]
    
    cron?: Cron[]

    [others: string]: any
  }
}
