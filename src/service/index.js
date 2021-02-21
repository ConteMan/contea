import request from '@/utils/request.js'
import { getArrayItem } from '@/utils/index.js'
import {
  list,
  platformCount,
} from '@/service/info.js'
import {
  get as configGet,
  put as configPut,
  set as configSet,
  all as configAll,
  enablePlatform
} from '@/service/config.js'
import {
  platforms as configPlatforms,
  defaultConfig
} from '@/config'

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
    console.log({ platform, offset, pageSize })
    return await list({ platform, offset, pageSize })
  }

  /**
   * 侧边 Tab，即开启的平台
   *
   * @return {Array} - 平台信息数组
   */
  tabs = async(params) => {
    const defaultTab = [
      {
        platform: 'all',
        name: '全部'
      }
    ]
    const platforms = await enablePlatform()
    let totalCount = 0
    if (platforms.length) {
      for (const index in platforms) {
        const tempCount = await platformCount(platforms[index].platform)
        platforms[index].count = tempCount
        totalCount += tempCount
      }
    }
    defaultTab[0].count = totalCount
    return [...defaultTab, ...platforms]
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

  // 平台信息
  platformInfo = async(params) => {
    const { platforms } = params
    const infoRes = {}
    for (const platform of platforms) {
      const itemClass = await import('../modules/' + platform)
      const itemInstance = itemClass.default.getInstance()
      const res = await itemInstance.loginStatus()
      const info = getArrayItem(configPlatforms, 'platform', platform)
      const objRes = {
        [platform]: {
          loginStatus: res,
          info,
        }
      }
      Object.assign(infoRes, objRes)
    }
    return infoRes
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

  // 批量设置配置
  setConfigs = async(params) => {
    const { configs } = params
    let [success, fail] = [0, 0]
    const configNames = Object.keys(configs)
    for (const name of configNames) {
      const res = await configSet(name, configs[name])
      res ? success++ : fail++
    }
    return { success, fail }
  }

  // 同步数据到接口
  sync = async() => {
    let [success, fail] = [0, 0]
    const apiUrlObj = await configGet('sync_api_url')
    if (!apiUrlObj) {
      return { success, fail }
    }
    const apiUrl = apiUrlObj.value
    const platform = 'all'
    const pageSize = 20
    let offset = 0
    let hasMore = true
    while (hasMore) {
      console.log({ apiUrl, platform, offset, pageSize })
      const infos = await list({ platform, offset, pageSize })
      const dataLength = infos.length
      if (dataLength) {
        for (const item of infos) {
          const res = await request({
            url: apiUrl,
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
              platformType: item.platform_type,
              content: item,
            }
          })
          res.status === 200 ? success++ : fail++
        }
      }
      if (dataLength === pageSize) {
        offset += pageSize
      } else {
        hasMore = false
      }
    }
    return { success, fail }
  }
}
