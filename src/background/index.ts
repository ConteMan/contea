import browser from 'webextension-polyfill'

interface IVersion {
  isDev: boolean
  version?: string
  type?: string
}

const currentUrl = browser.runtime.getURL('')
const extensionId = currentUrl.replace(/chrome-extension:\/\/|\//g, '')

async function getVersion(): Promise<IVersion> {
  const res = await fetch('/version.json', {
    method: 'GET',
  })
    .then((res: any) => res.json())
    .catch(() => false)

  return res ?? { isDev: false }
}

let version: IVersion = {
  isDev: false,
}

browser.runtime.onInstalled.addListener(async() => {
  // eslint-disable-next-line no-console
  console.log('init')

  // eslint-disable-next-line no-console
  console.log('watching ...2ssss')

  version = await getVersion()

  // eslint-disable-next-line no-console
  console.log(`[version] ${JSON.stringify(version)} ...`)
})

if (version) {
  browser.alarms.create(
    'DEV_WATCH',
    {
      periodInMinutes: 0.1,
    })
}

browser.alarms.onAlarm.addListener(async(alarm: { name: any }) => {
  const { name } = alarm

  // eslint-disable-next-line no-console
  console.log(`[bg onAlarm] > ${name}`)

  if (name === 'DEV_WATCH') {
    const currentVersion = await getVersion()
    if (currentVersion.version !== version.version) {
      if (currentVersion.type === 'background') {
        // eslint-disable-next-line no-console
        console.log(`[bg DEV_WATCH]> background ${JSON.stringify(currentVersion)}`)
        browser.runtime.reload()
        return
      }
      else {
        const tabs = await browser.tabs.query({ active: true })
        if (Object.keys(tabs).length) {
          tabs.forEach((item) => {
            const idReg = new RegExp(`/.*${extensionId}.*/`)
            if (item?.url && idReg.test(item.url)) {
              browser.tabs.reload(item.id)
              // eslint-disable-next-line no-console
              console.log(`[bg DEV_WATCH reload]> ${item.id}`)
            }
          })
        }
        // eslint-disable-next-line no-console
        console.log(`[bg DEV_WATCH extensionId]> ${extensionId}`)
        // eslint-disable-next-line no-console
        console.log(`[bg DEV_WATCH tabs]> ${JSON.stringify(tabs)}`)
      }

      version = currentVersion
    }
  }
})
