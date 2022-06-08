import { defineStore } from 'pinia'
import type { alarmName } from '@localTypes/message'

type updateSign = 0 | 1 | 2

interface alarmsType {
  alarms: {
    weread: updateSign
    v2ex: updateSign
    wakatime: updateSign
    one: updateSign
  }
}

export const useAlarmState = defineStore('alarm', {
  state: () => {
    return {
      alarms: {
        weread: 0,
        v2ex: 0,
        wakatime: 0,
        one: 0,
      },
    } as alarmsType
  },
  actions: {
    addAlarm(name: alarmName, update: 0|1|2 = 1) {
      this.alarms[name] = update
      this.alarms = { ...this.alarms }
    },
    removeAlarm(name: alarmName) {
      this.alarms[name] = 0
      this.alarms = { ...this.alarms }
    },
  },
})
