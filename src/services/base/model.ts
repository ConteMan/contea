export type InfoItem = {
  module: string
  module_type: string
  [other: string]: any
}

export type InfoList = InfoItem []

export type BaseConfig = {
  enable?: boolean
  alarm?: number
  [other: string]: any
}

export type BaseModule = {
  ca_login?: boolean
  ca_expried?: number
  ca_updated_at?: number
}
