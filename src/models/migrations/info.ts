export interface Info {
  id?: number
  ca_slug: string
  ca_module: string
  ca_module_type: string
  ca_sort_at: number
  [other: string]: any
}

export const info = '++id,ca_slug,ca_module,ca_module_type,ca_sort_at'
