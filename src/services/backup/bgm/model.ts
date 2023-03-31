export type Config = Module.BaseConfig & {
  key: string
  name: string
  enable: boolean
  site: string
  apiUrl: string
  expired?: number
  token?: string // AccessToken
  alarm?: number
}

export type ShowConfig = Pick<
  Config,
  'key' | 'name' | 'enable' | 'site' | 'apiUrl' | 'expired' | 'alarm'
>

export const config: Config = {
  key: 'bgm',
  name: 'Bangumi',
  enable: false,

  board_menu: [],

  cron: [],

  alarm: 60,
  expired: 3600,

  site: 'https://bgm.tv',
  apiUrl: 'https://api.bgm.tv/v0',
  token: '',
}
