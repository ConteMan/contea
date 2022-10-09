import type { Tabs } from 'webextension-polyfill'
import _ from 'lodash-es'
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
  if (!targetTab || !targetTab.id || !targetTab.url) {
    browser.tabs.create({ active: true, url: pageUrl, index: tabs.length })
    return true
  }

  // 存在扩展标签页
  // 非「显式链接」
  if (!isExtensionPage(targetTab.url)) {
    if (targetTab.id)
      browser.tabs.remove(targetTab.id) // 移除旧标签页

    const tab = await browser.tabs.create({ active: true, url: pageUrl, index: tabs.length })
    // eslint-disable-next-line no-console
    console.log('[ tab ] >', tab)
  }
  else {
    if (!targetTab.active) { // 非活跃状态
      browser.tabs.move(targetTab.id, { index: -1 })
      browser.tabs.update(targetTab.id, { active: true })
      return true
    }

    // 活跃状态，向标签页发消息，切换展示模式
    const message: Message.BaseMessage = { type: 'change-mode' }
    browser.tabs.sendMessage(targetTab.id, message)
  }
}

/**
 * 激活当前窗口下一个标签页
 */
export async function nextTab(tabId = 0) {
  if (!tabId)
    return false

  const tabs = await browser.tabs.query({ currentWindow: true }) // 当前窗口全部标签页
  const index = _.findIndex(tabs, (item) => {
    return item.id === tabId
  })

  if (index < 0)
    return false

  const nextId = index < tabs.length - 1 ? tabs[index + 1].id : tabs[0].id
  if (nextId)
    browser.tabs.update(nextId, { active: true })
  return true
}
