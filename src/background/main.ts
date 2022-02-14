import configState from '~/models/keyValue/configState'
import AlarmService from '~/services/base/alarm'

// 扩展地址
const currentUrl = browser.runtime.getURL('')
// 默认新标签页路径
const defaultPath = '/zen'

// 开发模式
if (import.meta.hot) {
  // eslint-disable-next-line no-console
  console.log(`[contea] > develop mode, ${currentUrl}`)
}
else {
  // eslint-disable-next-line no-console
  console.log('[contea] > build mode')
}

/**
 * 安装后初始化
 */
browser.runtime.onInstalled.addListener((): void => {
  configState.init()

  // 加载内容脚本
  import('./contentScriptHMR')
})

/**
 * 消息监听
 */
browser.runtime.onMessage.addListener(async(message) => {
  const { command, param } = message

  let data = {}
  if (command === 'get-page')
    data = { command, param }

  return {
    command,
    data,
  }
})

/**
 * 定时事件监听
 */
browser.alarms.onAlarm.addListener(async(alarm) => {
  const { name } = alarm
  await AlarmService.alarmDeal(name)
})

/**
 * 扩展绑定快捷键监听
 */
browser.commands.onCommand.addListener(async(command) => {
  if (command === 'change-mode')
    changeMode()
})

/**
 * 切换模式常量
 */
const extensionId = currentUrl.replaceAll(/chrome-extension:\/\/|\//g, '')

/**
 * 判断新标签页
 */
function isExtensionPage(url: string) {
  const regex = new RegExp(extensionId)
  return regex.test(url)
}

/**
 * 快捷键切换标签页模式
 */
async function changeMode() {
  const tabs = await browser.tabs.query({ currentWindow: true })

  // 查询新标签页
  let targetTab = {} as any
  tabs.every((item) => {
    if (item.url && (item.url === 'chrome://newtab/' || isExtensionPage(item.url))) {
      targetTab = item
      return false
    }
    return true
  })

  const pagePath = (await configState.getItem('base'))?.[defaultPath] ?? defaultPath
  const pageUrl = `chrome-extension://${extensionId}/dist/newTab/index.html#${pagePath}`

  // 当前窗口存在新标签页
  if (Object.keys(targetTab).length) {
    if (!isExtensionPage(targetTab.url)) {
      // 移除旧标签页
      browser.tabs.remove(targetTab.id)
      browser.tabs.create({ active: true, url: pageUrl })
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
    await browser.tabs.create({ active: true, url: pageUrl })
  }
}
