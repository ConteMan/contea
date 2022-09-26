export interface Movie {
  id?: number
  updated_at: number
  created_at: number

  status: number
  douban_id: string

  libvio_id?: number
  libvio_data?: string

  [other: string]: any
}

export const movie = '++id, updated_at, created_at, status, douban_id'
