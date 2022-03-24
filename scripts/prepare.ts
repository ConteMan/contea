// generate stub version.json files for dev entry
import { execSync } from 'child_process'
import fs from 'fs-extra'
import chokidar from 'chokidar'
import { isDev, log, r } from '../utils'

/**
 * Stub version.json in development
 */
async function stubVersionJSON(type = '') {
  const version = new Date().getTime()
  await fs.writeFile(r('extension/version.json'), JSON.stringify({ version, type }), 'utf-8')
  log('PRE', `version: ${version}`)
}

function writeManifest() {
  execSync('npx esno ./scripts/manifest.ts', { stdio: 'inherit' })
}

writeManifest()

console.log(`[prepare]> ${isDev}`)

if (isDev) {
  stubVersionJSON()
  chokidar.watch(r('extension/dist/**/*'))
    .on('change', (path) => {
      if (/.*\/background\/.*/.test(path)) {
        log('PRE', `path: ${path}`)
        stubVersionJSON('background')
      }
      else {
        stubVersionJSON()
      }
    })
  chokidar.watch([r('src/manifest.ts'), r('package.json')])
    .on('change', () => {
      writeManifest()
      stubVersionJSON('background')
    })
}
