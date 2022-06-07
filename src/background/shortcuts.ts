import type { message } from '@localTypes/message'
import configState from '@models/keyValue/configState'

/**
 * 快捷键切换标签页模式
 */
export async function changeMode(extensionId: string) {
  const defaultPath = '/module'
  const tabs = await browser.tabs.query({ currentWindow: true })

  // 判断页面是否为扩展页面
  function isExtensionPage(url: string) {
    const regex = new RegExp(extensionId)
    return regex.test(url)
  }

  // 查询新标签页
  let targetTab = {} as any
  tabs.every((item: any) => {
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
      if (!targetTab.active) {
        await browser.tabs.update(targetTab.id, { active: true })
      }
      else {
        const message: message = { type: 'change-mode' }
        await browser.tabs.sendMessage(targetTab.id as number, message)
      }
    }
  }
  else {
    await browser.tabs.create({ active: true, url: pageUrl })
  }
}
