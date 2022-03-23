// generate stub index.html files for dev entry
import { execSync } from 'child_process'
import fs from 'fs-extra'
import chokidar from 'chokidar'
import { isDev, log, r } from '../utils'

/**
 * Stub index.html to use Vite in development
 */
async function stubIndexHtml(type = '') {
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
  stubIndexHtml()
  chokidar.watch(r('extension/dist/**/*'))
    .on('change', (path) => {
      if (/.*\/background\/.*/.test(path)) {
        log('PRE', `path: ${path}`)
        stubIndexHtml('background')
      }
      else {
        stubIndexHtml()
      }
    })
  chokidar.watch([r('src/manifest.ts'), r('package.json')])
    .on('change', () => {
      writeManifest()
      stubIndexHtml('background')
    })
}
