// import { sendMessage, onMessage } from 'webext-bridge'
import { Tabs } from 'webextension-polyfill'
import { defHttp } from '~/utils/http/axios'
import configState from '~/models/keyValue/configState'
import AlarmService from '~/services/base/alarm'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  // import('./contentScriptHMR')
}

// 安装后执行
browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
  configState.init()
})

let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }

  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(previousTabId)
    previousTabId = tabId
  }
  catch {
    return
  }

  // eslint-disable-next-line no-console
  console.log('previous tab', tab)
  // sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })

  // const page = await defHttp.get({
  //   url: 'https://mp.weixin.qq.com/s/UhFBygOQom0giomxAtTY7Q',
  // })
  // // eslint-disable-next-line no-console
  // console.log('page', page)
})

// onMessage('get-current-tab', async() => {
//   try {
//     const tab = await browser.tabs.get(previousTabId)
//     return {
//       title: tab?.id,
//     }
//   }
//   catch {
//     return {
//       title: undefined,
//     }
//   }
// })

// onMessage('get-page', async({ data }) => {
//   const { url } = data as any
//   return await defHttp.get({
//     url,
//   })
// })

browser.runtime.onMessage.addListener(async(message, sender) => {
  // eslint-disable-next-line no-console
  console.log({ message, sender })

  const { command, param } = message

  let data = {}
  if (command === 'get-page') {
    data = await defHttp.get({
      url: param.url,
    })
  }

  return {
    command,
    data,
  }
})

// 定时任务
browser.alarms.onAlarm.addListener(async(alarm) => {
  const { name } = alarm
  // eslint-disable-next-line no-console
  console.log(name)

  await AlarmService.alarmDeal(name)
})

// 按键监听
browser.commands.onCommand.addListener(async(command) => {
  // eslint-disable-next-line no-console
  console.log(`Command "${command}" called`)
  const tab = await browser.tabs.query({ active: true, currentWindow: true })
  // eslint-disable-next-line no-console
  console.log('command tab', tab)
  if (tab[0]?.url === 'chrome://newtab/') {
    // browser.runtime.sendMessage({ data: 'change-mode' })
    const response = await browser.tabs.sendMessage(tab[0].id as number, { data: 'change-mode' })
    // eslint-disable-next-line no-console
    console.log('command tab response', response)
  }
})
