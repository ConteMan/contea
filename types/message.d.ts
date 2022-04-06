export interface message {
  type: string
  name?: string
  data?: any
}

export type alarmName = 'weread' | 'v2ex' | 'wakatime'
