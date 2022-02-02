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

browser.runtime.onMessage.addListener(async(message) => {
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
  await AlarmService.alarmDeal(name)
})

// 按键监听
browser.commands.onCommand.addListener(async(command) => {
  if (command === 'change-mode')
    changeMode()
})

/** ******** 按键监听 ******** **/
const extensionId = 'eincieaedhdbmhnpcckndljjkbknbnlo'
const extensionPageUrl = 'chrome-extension://eincieaedhdbmhnpcckndljjkbknbnlo/dist/newTab/index.html#/home'

// 判断新标签页
function isExtensionPage(url: string) {
  const regex = new RegExp(extensionId)
  return regex.test(url)
}

// 快捷键切换标签页模式
async function changeMode() {
  const tabs = await browser.tabs.query({ currentWindow: true })

  // 查询新标签页
  let targetTab = {} as any
  tabs.forEach((item) => {
    if (item.url === 'chrome://newtab/')
      targetTab = item
    if (item.url && isExtensionPage(item.url))
      targetTab = item
  })

  // 当前窗口存在新标签页
  if (Object.keys(targetTab).length) {
    if (!isExtensionPage(targetTab.url)) {
      // 删除旧标签页
      browser.tabs.remove(targetTab.id)
      browser.tabs.create({ active: true, url: extensionPageUrl })
    }
    else {
      // 激活标签页
      if (!targetTab.active)
        await browser.tabs.update(targetTab.id, { active: true })
      else
        await browser.tabs.sendMessage(targetTab.id as number, { data: 'change-mode' })
    }
  }
  else {
    await browser.tabs.create({ active: true, url: extensionPageUrl })
  }
}
