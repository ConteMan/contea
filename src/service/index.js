import { list } from '@/service/info.js'
import {
  put as configPut,
  set as configSet,
  all as configAll,
  enablePlatform
} from '@/service/config.js'
import { defaultConfig } from '@/config'

export default class Service {
  static getInstance() {
    if (!this.instance) {
      this.instance = new Service()
    }
    return this.instance
  }

  // 初始化数据
  static init = async() => {
    const result = []
    for (const item of defaultConfig) {
      const res = await configPut(item)
      result.push(res)
    }
    return result
  }

  // 列表
  list = async(params) => {
    const { platform, offset, pageSize } = params

    return await list({ platform, offset, pageSize })
  }

  // 启用平台
  tabs = async(params) => {
    const defaultTab = [
      {
        platform: 'all',
        name: '全部'
      }
    ]
    const res = await enablePlatform()
    return defaultTab.concat(res)
  }

  // 同步数据
  syncInfo = async(params) => {
    const { platforms } = params
    const syncRes = {}
    for (const platform of platforms) {
      const itemClass = await import('../modules/' + platform)
      const itemInstance = itemClass.default.getInstance()
      syncRes[platform] = await itemInstance.sync()
    }
    return syncRes
  }

  // 登录状态
  loginStatus = async(params) => {
    const { platforms } = params
    const statusRes = {}
    for (const platform of platforms) {
      const itemClass = await import('../modules/' + platform)
      const itemInstance = itemClass.default.getInstance()
      const res = await itemInstance.loginStatus()
      const objRes = { [platform]: res }
      Object.assign(statusRes, objRes)
    }
    return statusRes
  }

  // 获取配置
  config = async(
    {
      type = 'all',
    }
  ) => {
    const res = {}
    if (type === 'all') {
      const configs = await configAll()
      for (const config of configs) {
        res[config.name] = config.value
      }
    }
    return res
  }

  // 设置配置
  setConfig = async(params) => {
    const { key, value } = params
    const res = await configSet(key, value)
    return res ? 1 : 0
  }
}
