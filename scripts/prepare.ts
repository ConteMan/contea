// generate stub version.json files for dev entry
import { execSync } from 'node:child_process'
import _ from 'lodash-es'
import fs from 'fs-extra'
import chokidar from 'chokidar'
import { isDev, log, r } from '@utils/script'

/**
 * Stub version.json in development
 */
function stubVersionJSON(type = '') {
  const version = new Date().getTime()
  void fs.writeFile(r('extension/version.json'), `{ "version": ${version}, "type": "${type}", "isDev": true }\n`, 'utf-8')
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
    .on('change', _.throttle((path) => {
      if (/.*\/background\/.*/.test(path)) {
        log('PRE', `path: ${path}`)
        stubVersionJSON('background')
      }
      else {
        log('PRE', `path: ${path}`)
        stubVersionJSON()
      }
    }, 1000))
  chokidar.watch([r('src/manifest.ts'), r('package.json')])
    .on('change', () => {
      writeManifest()
      stubVersionJSON('background')
    })
}
