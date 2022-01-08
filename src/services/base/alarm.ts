import sspai from '../sspai'
import configState from '~/models/keyValue/configState'
import v2ex from '~/services/v2ex'

class AlarmSetting {
  async setAlarm(module: string) {
    const modules = ['v2ex', 'sspai']

    if (!modules.includes(module))
      return false

    const exist = await browser.alarms.get(module)
    if (exist)
      await browser.alarms.clear(module)

    const { enable, alarm, enableTypes } = await configState.getItem(module)
    if (!enable || !alarm || !enableTypes?.length)
      return false

    browser.alarms.create(
      module,
      {
        periodInMinutes: alarm,
      })

    const alarms = await browser.alarms.getAll()
    // eslint-disable-next-line no-console
    console.log(alarms)

    return true
  }

  async clearByModule(module: string) {
    const alarms = await browser.alarms.getAll()
    for (const item of alarms) {
      // eslint-disable-next-line prefer-regex-literals
      // eslint-disable-next-line prefer-template
      const reg = new RegExp('/^' + module + '\-(.)+$/')
      if (item.name.match(reg))
        await browser.alarms.clear(item.name)
    }
  }

  /**
   * 定时任务处理
   * @param module string - 模块名称
   */
  async alarmDeal(module: string) {
    const { enableTypes } = await configState.getItem(module)
    if (!enableTypes || !enableTypes.length)
      return false

    if (module === 'v2ex')
      await v2ex.tabLists(enableTypes)
    if (module === 'sspai')
      await sspai.lists(enableTypes)

    return true
  }
}

export default new AlarmSetting()
