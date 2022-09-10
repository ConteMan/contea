export interface Cache {
  id?: number
  key: string
  [other: string]: any
}

export const cache = '++id, key'
