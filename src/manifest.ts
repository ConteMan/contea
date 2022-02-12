import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'

interface newManifest extends Omit<Manifest.WebExtensionManifest, 'commands'> {
  commands?: {
    [other: string]: Manifest.WebExtensionManifest['commands'] & { global?: boolean }
  }
}

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: newManifest = {
    manifest_version: 2,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    browser_action: {
      default_icon: './assets/icon-128.png',
      default_popup: './dist/popup/index.html',
    },
    options_ui: {
      page: './dist/newTab/index.html',
      open_in_tab: true,
      chrome_style: false,
    },
    background: {
      page: './dist/background/index.html',
      persistent: false,
    },
    icons: {
      16: './assets/icon-128.png',
      48: './assets/icon-128.png',
      128: './assets/icon-128.png',
    },
    permissions: [
      'tabs',
      'storage',
      'activeTab',
      'cookies',
      'alarms',
      'bookmarks',
      'history',
      'commands',
      'http://*/',
      'https://*/',
    ],
    // 覆盖浏览器默认页面
    chrome_url_overrides:
    {
      // 覆盖浏览器默认的新标签页
      newtab: './dist/newTab/index.html',
    },
    commands: {
      '_execute_browser_action': {
        suggested_key: {
          default: 'Alt+Q',
          mac: 'Alt+Q',
        },
        description: '激活新标签页',
        global: true,
      },
      'change-mode': {
        suggested_key: {
          default: 'Alt+W',
          mac: 'Alt+W',
        },
        description: 'Change Mode',
      },
    },
    // content_scripts: [{
    //   matches: ['http://*/*', 'https://*/*'],
    //   js: ['./dist/contentScripts/index.global.js'],
    // }],
    // web_accessible_resources: [
    //   'dist/contentScripts/style.css',
    // ],
    // eslint-disable-next-line quotes
    content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  }

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts
    manifest.permissions?.push('webNavigation')

    // this is required on dev for Vite script to load
    manifest.content_security_policy = `script-src \'self\' \'unsafe-eval\' http://localhost:${port}; object-src \'self\'`
  }

  return manifest
}
