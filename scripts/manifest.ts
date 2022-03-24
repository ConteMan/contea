import fs from 'fs-extra'
import { log, r } from '@utils/script'
import { getManifest } from '~/manifest'

export async function writeManifest() {
  const dir = 'extension'
  await fs.writeJSON(r(`${dir}/manifest.json`), await getManifest(), { spaces: 2 })
  log('PRE', 'write manifest.json')
}

writeManifest()
