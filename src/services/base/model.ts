export type InfoItem = {
  module: string
  module_type: string
  [other: string]: any
}

export type InfoList = InfoItem []

export type BaseModule = {
  enable?: boolean
  alarm?: number
  [other: string]: any
}
