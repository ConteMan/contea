export type Config = {
  key: string
  enable: boolean
  url: string
  enableTypes: any[]
  expried: number
  name?: string
  site?: string
  apiUrl?: string
  cdnUrl?: string
  alarm?: number
}

export type User = {
  updatedAt?: number
  expried?: number

  [propName: string]: any
}
