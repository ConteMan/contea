import ConfigModel from '@models/config'

import sspai from '@services/sspai'
import movie from '@services/movie'
import bilibili from '@services/bilibili'
import one from '@services/one'

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
  async dealAlarm(module: string) {
    const configInfo = await ConfigModel.getItem(module)

    const { enable } = configInfo
    if (!enable)
      return false

    switch (module) {
      case 'sspai': {
        const { enableTypes } = configInfo
        await sspai.lists(enableTypes)
        break
      }
      case 'movie': {
        await movie.sync()
        break
      }
      case 'bilibili': {
        await bilibili.moduleInfo(true)
        await bilibili.sign()
        break
      }
      case 'one': {
        await one.list(true)
        break
      }
      default: {
        break
      }
    }
    return true
  }
}

export default new Alarm()
