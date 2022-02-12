import fs from 'fs-extra'
import { getManifest } from '../src/manifest'
import { r, log, isDev } from './utils'

export async function writeManifest() {
  const dir = isDev ? 'extension' : 'extension_build'
  await fs.writeJSON(r(`${dir}/manifest.json`), await getManifest(), { spaces: 2 })
  log('PRE', 'write manifest.json')
}

writeManifest()
