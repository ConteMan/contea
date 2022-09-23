import type { Tabs } from 'webextension-polyfill'
import { ConfigModel } from '@models/index'

/**
 * 快捷键切换标签页模式
 */
export async function changeMode(extensionId: string) {
  const defaultPath = '/'
  const tabs = await browser.tabs.query({ currentWindow: true }) // 当前窗口全部标签页

  // 判断是否为「显式链接」的扩展页面
  function isExtensionPage(url: string) {
    const regex = new RegExp(extensionId)
    return regex.test(url)
  }

  // 查询新标签页
  let targetTab: Tabs.Tab | undefined
  tabs.every((item: any) => {
    if (item.url && (item.url === 'chrome://newtab/' || isExtensionPage(item.url))) {
      targetTab = item
      return false
    }
    return true
  })

  const pagePath = (await ConfigModel.getItem('base'))?.[defaultPath] ?? defaultPath
  const pageUrl = `chrome-extension://${extensionId}/dist/newTab/index.html#${pagePath}`

  // 不存在扩展标签页
  if (!targetTab || !targetTab.url) {
    browser.tabs.create({ active: true, url: pageUrl })
    return true
  }

  // 存在扩展标签页
  // 非「显式链接」
  if (!isExtensionPage(targetTab.url)) {
    if (targetTab.id)
      browser.tabs.remove(targetTab.id) // 移除旧标签页

    browser.tabs.create({ active: true, url: pageUrl })
  }
  else {
    if (!targetTab.active) { // 非活跃状态
      browser.tabs.update(targetTab.id, { active: true })
      return true
    }

    if (targetTab.id) { // 活跃状态，向标签页发消息，切换展示模式
      const message: Message.BaseMessage = { type: 'change-mode' }
      browser.tabs.sendMessage(targetTab.id, message)
    }
  }
}
