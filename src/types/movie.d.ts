namespace Movie {
  export interface Item {
    title?: string
    [other: string]: any
  }
  export type List = Item []
  export type MovieModules = 'libvio' | 'ddrk'
}
