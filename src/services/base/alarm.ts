import { ConfigModel } from '@models/index'

import sspai from '@services/sspai'
import movie from '@services/movie'
import bilibili from '@services/bilibili'
import one from '@services/one'
import weread from '@services/weread'

class Alarm {
  /**
   * 设置定时任务
   * @param module - 模块名称
   */
  async setAlarm(module: string) {
    const { enable, alarm } = await ConfigModel.getItem(module)

    const exist = await browser.alarms.get(module)
    if (exist) {
      if (enable && alarm === exist.periodInMinutes)
        return true
      else
        await browser.alarms.clear(module)
    }

    if (!enable || !alarm)
      return false

    browser.alarms.create(
      module,
      {
        periodInMinutes: alarm,
      })

    return true
  }

  /**
   * 处理定时任务
   * @param module string - 模块名称
   */
  async dealAlarm(module: string, source: 'service_worker' | 'page' = 'service_worker') {
    const configInfo = await ConfigModel.getItem(module)

    const { enable } = configInfo
    if (!enable)
      return false

    let result

    switch (module) {
      case 'sspai': {
        const { enableTypes } = configInfo
        result = await sspai.lists(enableTypes)
        break
      }
      case 'movie': {
        if (source === 'service_worker')
          result = await movie.sync()
        if (source === 'page')
          result = await movie.getList('libvio', true)
        break
      }
      case 'bilibili': {
        const moduleInfo = await bilibili.moduleInfo(true)
        const sign = await bilibili.sign()
        result = { moduleInfo, sign }
        break
      }
      case 'one': {
        result = await one.list(true)
        if (result)
          await one.sync(result.data)
        break
      }
      case 'weread': {
        result = await weread.moduleInfo(true)
        break
      }
      default: {
        break
      }
    }
    return result
  }
}

export default new Alarm()
