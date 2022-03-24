import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { r } from '../utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 3,
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    action: {
      default_icon: './assets/icon-128.png',
      default_popup: './dist/popup/index.html',
    },
    options_ui: {
      page: './dist/options/index.html',
      open_in_tab: true,
    },
    background: {
      service_worker: './dist/background/index.global.js',
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
      'webNavigation',
      'scripting',
      'declarativeNetRequest',
      'declarativeNetRequestFeedback',
    ],
    host_permissions: [
      '<all_urls>',
    ],
    chrome_url_overrides:
    {
      newtab: './dist/newTab/index.html',
    },
    commands: {
      '_execute_browser_action': {
        suggested_key: {
          default: 'Alt+Q',
          mac: 'Alt+Q',
        },
        description: '激活新标签页',
      },
      'change-mode': {
        suggested_key: {
          default: 'Alt+W',
          mac: 'Alt+W',
        },
        description: 'Change Mode',
      },
    },
    web_accessible_resources: [
      {
        resources: ['dist/contentScripts/style.css'],
        matches: ['<all_urls>'],
      },
    ],
    content_security_policy: {
      extension_pages: 'script-src \'self\'; object-src \'self\'',
    },
  }

  return manifest
}
