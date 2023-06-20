export interface Log {
  id?: number
  type: string
  [other: string]: any
}

export const log = '++id, type'
