import { ConfigModel } from '@models/index'
import { MODULES } from '@enums/index'

import sspai from '@services/sspai'
import movie from '@services/movie'
import bilibili from '@services/bilibili'
import one from '@services/one'
import weread from '@services/weread'
import weather from '@services/weather'
import { football } from '@services/sport'
import { getRandomIntInclusive, sleep } from '@utils/index'

class Alarm {
  /**
   * 设置定时任务
   * @param module - 模块名称
   */
  async setAlarm(module: string) {
    const { enable, alarm = false } = await ConfigModel.getItem(module)

    if (enable && alarm)
      void this.dealAlarm(module, 'page')

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
      case MODULES.SSPAI: {
        const { enableTypes } = configInfo
        result = await sspai.lists(enableTypes)
        break
      }
      case MODULES.MOVIE: {
        if (source === 'service_worker')
          result = await movie.sync()
        if (source === 'page')
          result = await movie.getList('libvio', true)
        break
      }
      case MODULES.BILIBILI: {
        const moduleInfo = await bilibili.moduleInfo(true)
        const sign = await bilibili.sign()
        result = { moduleInfo, sign }
        break
      }
      case MODULES.ONE: {
        result = await one.list(true)
        if (result)
          await one.sync(result.data)
        break
      }
      case MODULES.WEREAD: {
        result = await weread.moduleInfo(true)
        break
      }
      case MODULES.SPORT : {
        if (source === 'page') {
          const competitionRankRes: { id: number; res: any }[] = []
          const competitionIds = Object.keys(football.COMPETITIONS)
          for (const competitionId of competitionIds) {
            const id = parseInt(competitionId)
            const res = await football.getCompetitionRank(id, true)
            competitionRankRes.push({
              id,
              res,
            })
            await sleep(getRandomIntInclusive(2000, 5000))
          }
          result = {
            competitionRank: competitionRankRes,
          }
        }
        break
      }
      case MODULES.WEATHER: {
        result = await weather.data('cma', { stationId: 59493 }, true)
        break
      }
      default: {
        result = false
        break
      }
    }
    return result
  }
}

export default new Alarm()
