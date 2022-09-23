export interface AlarmTask {
  id?: number
  name: string
  set_at: number
  deal_at: number
  [other: string]: any
}

export const alarmTask = '++id, name, set_at, deal_at'
