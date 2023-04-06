type Config = Module.BaseConfig & {
  defaultPath: string
  themeMode: boolean // true => system, false => manual

  // 世界线
  statusList: boolean // 任务
  testPage: boolean // 测试
  dashboardPage: boolean // 面板
  moduleBookmark: boolean // 书签
  moduleExtension: boolean // 扩展

  // 桌面端
  enableDesktop: boolean // 是否启用与桌面端的通讯
  desktopInterface: string // 桌面端接口地址
  desktopInterfaceStatus: boolean // 桌面端接口状态，true 连通，false 未连通

  url: { // 地址集合
    proxy_query: string // 请求代理
  }
}

type ConfigShow = Pick<
  Config,
  'key' | 'name' | 'enable' | 'expired' | 'alarm' | 'statusList' | 'themeMode' | 'enableDesktop' | 'desktopInterface' | 'desktopInterfaceStatus'
  >

const config: Config = {
  key: 'base',
  name: '基础',
  enable: true,

  board_menu: [
    {
      key: 'dashboard',
      name: '面板',
      enable: true,
      sort: 0,
    },
    {
      key: 'bookmark',
      name: '书签',
      enable: true,
      sort: 1,
    },
    {
      key: 'extension',
      name: '扩展',
      enable: true,
      sort: 2,
    },
    {
      key: 'status',
      name: '任务',
      enable: true,
      sort: 3,
    },
    {
      key: 'test',
      name: '测试',
      enable: true,
      sort: 4,
    },
  ],
  cron: [],

  alarm: 10,
  expired: 3600,

  url: {
    proxy_query: 'http://127.0.0.1:7002',
  },

  site: '',
  apiUrl: '',
  defaultPath: '/index',
  themeMode: true,

  statusList: false,
  testPage: false,
  dashboardPage: true,
  moduleBookmark: true,
  moduleExtension: true,

  enableDesktop: false,
  desktopInterface: 'http://127.0.0.1:7788/extension',
  desktopInterfaceStatus: false,
}

const configKeys = Object.keys(config)

export type {
  Config,
  ConfigShow,
}

export {
  config,
  configKeys,
}
