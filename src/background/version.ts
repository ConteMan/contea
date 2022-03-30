export interface IVersion {
  isDev: boolean
  version?: string
  type?: string
}

export async function getVersion(): Promise<IVersion> {
  const res = await fetch('/version.json', { method: 'GET' })
    .then((res: any) => res.json())
    .catch(() => false)

  return typeof res === 'boolean' ? { isDev: false } : res
}
