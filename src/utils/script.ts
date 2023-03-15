import { resolve } from 'node:path'
import { bgCyan, black } from 'kolorist'

export const r = (...args: string[]) => resolve(__dirname, '../..', ...args)

export function log(name: string, message: string) {
  // eslint-disable-next-line no-console
  console.log(black(bgCyan(` ${name} `)), message)
}

export const isDev = process.env.NODE_ENV !== 'production'
export const port = 9001
