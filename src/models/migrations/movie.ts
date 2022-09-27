export interface Movie {
  id?: number
  updated_at?: number
  created_at?: number
  status?: number

  douban_id: string
  source?: string
  info_at?: number

  libvio_id?: number
  libvio_data?: Record<string, any>

  [other: string]: any
}

export const movie = '++id, updated_at, created_at, status, douban_id, source, info_at'
