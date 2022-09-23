import { defineStore } from 'pinia'

type AlarmsData = Record<Alarm.StoreAlarms, Alarm.UpdateSign>

export const useAlarmState = defineStore('alarm', () => {
  const data: AlarmsData = reactive({
    weread: 0,
    one: 0,
  })
  const { weread, one } = toRefs(data)

  const addAlarm = (name: Alarm.StoreAlarms, update: Alarm.UpdateSign = 1) => {
    data[name] = update
  }

  const removeAlarm = (name: Alarm.StoreAlarms) => {
    data[name] = 0
  }

  return {
    weread,
    one,

    addAlarm,
    removeAlarm,
  }
})
