export interface Version {
  isDev: boolean
  version?: string
  type?: string
}

export async function getVersion(): Promise<Version> {
  const res = await fetch('/version.json', { method: 'GET' })
    .then((res: any) => res.json())
    .catch(() => false)

  return typeof res === 'boolean' ? { isDev: false } : res
}
