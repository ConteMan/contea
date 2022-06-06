// import dayjs from 'dayjs'

import configState from '@models/keyValue/configState'
import moduleState from '@models/keyValue/moduleState'
import requestState from '@models/keyValue/requestState'

import v2ex from '@services/v2ex'
import sspai from '@services/sspai'
import weread from '@services/weread'
import one from '@services/one'

class AlarmSetting {
  /**
   * 设置定时任务
   * @param module - 模块名称
   */
  async setAlarm(module: string) {
    const { enable, alarm } = await configState.getItem(module)

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
    // eslint-disable-next-line no-console
    console.log('>>> Services >> base alarm > dealAlarm - module: ', module)

    const configInfo = await configState.storage.query().get(module)
    // eslint-disable-next-line no-console
    console.log('>>> Services >> base alarm > dealAlarm - configInfo: ', configInfo)

    const { enable } = configInfo
    if (!enable)
      return false

    const moduleInfo = await moduleState.storage.query().get(module)
    // eslint-disable-next-line no-console
    console.log('>>> Services >> base alarm > dealAlarm - moduleInfo: ', moduleInfo)

    if (module === 'base') {
      const count = await requestState.clean()

      // eslint-disable-next-line no-console
      console.log('>>> Services >> base alarm > dealAlarm - requestState clean: ', count)
    }

    switch (module) {
      case 'v2ex': {
        const { enableTypes } = configInfo
        await v2ex.tabLists(enableTypes)

        const { data } = moduleInfo
        if (!data.mission || !data.mission?.date || dayjs().isAfter(dayjs(data.mission.date), 'day'))
          await v2ex.mission()

        await v2ex.updateModuleTypeData()
        break
      }
      case 'sspai': {
        const { enableTypes } = configInfo
        await sspai.lists(enableTypes)
        break
      }
      case 'weread': {
        await weread.updateModuleTypeData()
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

export default new AlarmSetting()
