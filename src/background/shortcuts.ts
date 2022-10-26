import type { Tabs } from 'webextension-polyfill'
import _ from 'lodash-es'
import { CONTENT_SCRIPT_COMMANDS } from '@enums/index'
import { ConfigModel } from '@models/index'

interface Param {
  type: 'search' | 'change-mode'
  action: 'default' | 'close'
}

/**
 * 快捷键切换标签页模式
 */
export async function changeMode(extensionId: string, params: Param = { type: 'change-mode', action: 'default' }) {
  const { type, action } = params
  const defaultPath = '/'
  const tabs = await browser.tabs.query({ currentWindow: true }) // 当前窗口全部标签页

  // 判断是否为「显式链接」的扩展页面
  function isExtensionPage(url: string) {
    const regex = new RegExp(extensionId)
    return regex.test(url)
  }

  async function sendToPage(tabId: number, type: string) {
    const message: Message.BaseMessage = { type }
    await browser.tabs.sendMessage(tabId, message)
  }

  async function removeTab(currentTab: Tabs.Tab | undefined, targetTab: Tabs.Tab | undefined, action: Param['action']) {
    if (action === 'close' && currentTab?.id && (targetTab?.id !== currentTab.id))
      await browser.tabs.remove(currentTab?.id)
  }

  // 查询新标签页
  let targetTab: Tabs.Tab | undefined
  let currentTab: Tabs.Tab | undefined
  tabs.forEach((item: any) => {
    if (item.url && (item.url === 'chrome://newtab/' || isExtensionPage(item.url)))
      targetTab = item
    if (item.active)
      currentTab = item
  })

  const pagePath = (await ConfigModel.getItem('base'))?.[defaultPath] ?? defaultPath
  const pageUrl = `chrome-extension://${extensionId}/dist/newTab/index.html#${pagePath}`

  // 不存在扩展标签页
  if (!targetTab || !targetTab.id || !targetTab.url) {
    if (type === 'search')
      await ConfigModel.addOrUpdateItem('BACKGROUND_SHORTCUT_SEARCH', { show: true }) // 新建标签页有加载过程，直接通讯会报错，所以采用 hack 方法，存储标识进行沟通
    await browser.tabs.create({ active: true, url: pageUrl, index: tabs.length })

    await removeTab(currentTab, targetTab, action)

    return true
  }

  // 存在扩展标签页
  // 非「显式链接」
  if (!isExtensionPage(targetTab.url)) {
    if (targetTab.id)
      browser.tabs.remove(targetTab.id) // 移除旧标签页

    if (type === 'search')
      await ConfigModel.addOrUpdateItem('BACKGROUND_SHORTCUT_SEARCH', { show: true })
    await browser.tabs.create({ active: true, url: pageUrl, index: tabs.length })
    await removeTab(currentTab, targetTab, action)
  }
  else {
    await browser.tabs.move(targetTab.id, { index: -1 })
    await removeTab(currentTab, targetTab, action)

    if (!targetTab.active) { // 非活跃状态
      if (targetTab.id && type === 'search')
        await sendToPage(targetTab.id, type)
      await browser.tabs.update(targetTab.id, { active: true })
      return true
    }

    if (targetTab.id && type === 'search')
      await sendToPage(targetTab.id, type)

    // 活跃状态，向标签页发消息，切换展示模式
    if (targetTab.id && type === 'change-mode')
      await sendToPage(targetTab.id, type)
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

/**
 * 处理内容脚本
 */
export async function dealContentScript() {
  try {
    const tabs = await browser.tabs.query({ currentWindow: true, active: true })
    const activeTab = tabs[0]
    // eslint-disable-next-line no-console
    console.log('[ activeTab ] >', activeTab)

    if (!activeTab.id)
      return false

    const message: Message.BaseMessage = { type: CONTENT_SCRIPT_COMMANDS.SHOW } // 直属消息，处理逻辑

    return await browser.tabs.sendMessage(activeTab.id, message)
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log('>>> background >> shortcuts > deal-content-script error', e)
    return false
  }
}
