import configState from '@models/keyValue/configState'

interface IVersion {
  isDev: boolean
  version?: string
  type?: string
}

const devStateKey = 'DEV_VERSION'

const currentUrl = browser.runtime.getURL('')
const extensionId = currentUrl.replace(/chrome-extension:\/\/|\//g, '')

async function getVersion(): Promise<IVersion> {
  const res = await fetch('/version.json', {
    method: 'GET',
  })
    .then((res: any) => res.json())
    .catch(() => false)

  return typeof res === 'boolean' ? { isDev: false } : res
}

let version: IVersion = {
  isDev: false,
}

browser.runtime.onInstalled.addListener(async() => {
  // eslint-disable-next-line no-console
  console.log('init')

  version = await getVersion()
  // eslint-disable-next-line no-console
  console.log(`[version] ${JSON.stringify(version)} ...`)

  if (version.isDev) {
    // eslint-disable-next-line no-console
    console.log('watching ...', { [devStateKey]: version })

    await browser.storage.local.set({ [devStateKey]: version })

    await browser.alarms.create(
      'DEV_WATCH',
      {
        periodInMinutes: 0.2,
      })
  }

  configState.init()
})

browser.alarms.onAlarm.addListener(async(alarm: { name: any }) => {
  const { name } = alarm

  // eslint-disable-next-line no-console
  console.log(`[bg onAlarm] > ${name}`)

  // 开发模式
  if (name === 'DEV_WATCH') {
    const currentVersion = await getVersion()
    const storage = await browser.storage.local.get([devStateKey])
    const oldVersion = storage[devStateKey]
    // eslint-disable-next-line no-console
    console.log(`[bg onAlarm DEV_WATCH] > ${currentVersion.version}`, oldVersion)
    if (currentVersion.version !== oldVersion.version) {
      browser.storage.local.set({ [devStateKey]: currentVersion })
      if (currentVersion.type === 'background') {
        // eslint-disable-next-line no-console
        console.log(`[bg DEV_WATCH]> background ${JSON.stringify(currentVersion)}`)
        browser.runtime.reload()
      }
      else {
        const tabs = await browser.tabs.query({ })
        if (Object.keys(tabs).length) {
          tabs.forEach((item: any) => {
            const idReg = new RegExp(`/.*${extensionId}.*/`)
            if (item?.url && (idReg.test(item.url) || /chrome:\/\/newtab.*/.test(item.url))) {
              browser.tabs.reload(item.id)
              // eslint-disable-next-line no-console
              console.log(`[bg DEV_WATCH reload]> ${item.id}`)
            }
          })
        }
      }
    }
  }
})

export {}
