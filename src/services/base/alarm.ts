import dayjs from 'dayjs'

import configState from '~/models/keyValue/configState'
import moduleState from '~/models/keyValue/moduleState'
import requestState from '~/models/keyValue/requestState'
import sspai from '~/services/sspai'
import v2ex from '~/services/v2ex'

class AlarmSetting {
  /**
   * 设置定时任务
   * @param module - 模块名称
   */
  async setAlarm(module: string) {
    const exist = await browser.alarms.get(module)
    if (exist)
      await browser.alarms.clear(module)

    const { enable, alarm } = await configState.getItem(module)
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
   * 定时任务处理
   * @param module string - 模块名称
   */
  async alarmDeal(module: string) {
    const res = await configState.getItem(module)

    const { enable } = res
    if (!enable)
      return false

    if (module === 'default') {
      const count = await requestState.clean()
      // eslint-disable-next-line no-console
      console.log('[ Alarm.default.clean ] >', count)
    }

    if (module === 'v2ex') {
      const { enableTypes } = res
      await v2ex.tabLists(enableTypes)
      await v2ex.user(false)

      const { data } = await moduleState.getItem(module)
      if (!data.mission || !data.mission?.date || dayjs().isAfter(dayjs(data.mission.date), 'day'))
        await v2ex.mission()
    }

    if (module === 'sspai') {
      const { enableTypes } = res
      await sspai.lists(enableTypes)
    }

    return true
  }
}

export default new AlarmSetting()
