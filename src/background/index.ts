import type { Runtime, Tabs } from 'webextension-polyfill'

import _ from 'lodash-es'

import { COMMANDS, MESSAGE_TYPES, MODULES } from '@enums/index'
import AlarmService from '@services/base/alarm'
import { AlarmTaskModel, ConfigModel } from '@models/index'
import { getVersion } from './version'
import { changeMode, dealContentScript, nextTab } from './shortcuts'
import { isObject } from '~/utils/is'

const EXTENSION_NAME = 'CONTEA'
const EXTENSION_ID = browser.runtime.getURL('').replace(/chrome-extension:\/\/|\//g, '')
const SERVICE_WORKER_NAME = `${EXTENSION_NAME}-${EXTENSION_ID}-${new Date().getTime()}-${_.random(10000, 99999)}`
const DEV_VERSION_KEY = 'DEV_VERSION'
const DEV_ALARM_NAME = 'DEV_WATCH'

/**
 * 初始化
 */
browser.runtime.onInstalled.addListener(async () => {
  try {
    const version = await getVersion()

    // eslint-disable-next-line no-console
    console.log(`[${SERVICE_WORKER_NAME}] >>> [bg] >> onInstalled / version ${JSON.stringify(version)}`)

    if (version.isDev) {
      await browser.storage.local.set({ [DEV_VERSION_KEY]: version })
      browser.alarms.create(
        DEV_ALARM_NAME,
        {
          periodInMinutes: 0.1,
        })
    }

    await ConfigModel.init('increase') // #1 安装时，增量初始化
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(`>>> [${SERVICE_WORKER_NAME}] >>> [bg] >> onInstalled error :`, e)
  }
})

/**
 * 监听定时任务
 * @param alarm string - 定时任务信息
 * - @param name string - 定时任务名称
 */
browser.alarms.onAlarm.addListener(async (alarm) => {
  try {
    const DEAL_MODULES: string[] = [MODULES.SSPAI, MODULES.MOVIE, MODULES.BILIBILI, MODULES.WEREAD, MODULES.WEATHER]
    const REDIRECT_MODULES: string[] = [MODULES.ONE, MODULES.MOVIE, MODULES.SPORT]
    const { name } = alarm

    if (![DEV_ALARM_NAME].includes(name))
      // eslint-disable-next-line no-console
      console.log(`[${SERVICE_WORKER_NAME}] >>> [bg] >> onAlarm > ${JSON.stringify(alarm)}`)

    // 开发模式
    if (name === DEV_ALARM_NAME) {
      const currentVersion = await getVersion()
      const storage = await browser.storage.local.get([DEV_VERSION_KEY])
      const oldVersion = storage[DEV_VERSION_KEY]

      if (currentVersion.version === oldVersion.version)
        return

      await browser.storage.local.set({ [DEV_VERSION_KEY]: currentVersion })

      // if (currentVersion.type === 'background') // 不处理 background 更新
      //   return

      const tabs = await browser.tabs.query({ }) // 查询所有标签页，处理扩展相关页面
      if (!Object.keys(tabs).length)
        return
      const idReg = new RegExp(`/.*${EXTENSION_ID}.*/`)
      tabs.forEach((item: any) => {
        if (item?.url && (idReg.test(item.url) || /chrome:\/\/newtab.*/.test(item.url)))
          browser.tabs.reload(item.id)
      })

      return
    }

    // 直接处理
    if (DEAL_MODULES.includes(name))
      await AlarmService.dealAlarm(name)

    // 页面处理
    // 如果存在多个扩展页面，优先发送给激活状态页面，其他页面仅做同步
    // 进一步操作：页面根据请求提交到后台，后台处理后返回结果，绕一圈主要是需要页面的 DOM 处理能力
    if (REDIRECT_MODULES.includes(name)) {
      const extensionTabs: Tabs.Tab[] = []
      const tabs = await browser.tabs.query({})

      if (!Object.keys(tabs).length)
        return

      const idReg = new RegExp(`/.*${EXTENSION_ID}.*/`)
      tabs.filter((item) => {
        return item?.url && (idReg.test(item.url) || /chrome:\/\/newtab.*/.test(item.url))
      }).forEach((item) => {
        item.active ? extensionTabs.splice(0, 0, item) : extensionTabs.push(item) // 激活的标签页放在最前面
      })

      if (!extensionTabs.length) {
        // 写入任务表
        await AlarmTaskModel.alarmAction(name, 'set')
        return
      }

      let message: Message.TabMessage = { type: 'alarm', name } // 直属消息，处理逻辑
      if (extensionTabs[0].id)
        await browser.tabs.sendMessage(extensionTabs[0].id, message)

      extensionTabs.shift()

      if (!extensionTabs.length)
        return

      message = { type: 'alarm-sync', name } // 同步消息，同步处理结果
      extensionTabs.every((item) => {
        if (item.id)
          browser.tabs.sendMessage(item.id, message)
        return true
      })
    }

    return
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(`[${SERVICE_WORKER_NAME}] >>> [bg] >> onAlarm error: `, e)
  }
})

/**
 * 监听扩展绑定的快捷键
 * @param command string - 快捷键名称
 */
browser.commands.onCommand.addListener(async (command: string) => {
  try {
    if (command === COMMANDS.CHANGE_MODE)
      await changeMode(EXTENSION_ID, { type: 'change-mode', action: 'default' })
    if (command === COMMANDS.CHANGE_MODE_CURRENT)
      await changeMode(EXTENSION_ID, { type: 'change-mode', action: 'close' })
    if (command === COMMANDS.SEARCH)
      await changeMode(EXTENSION_ID, { type: 'search', action: 'default' })
    if (command === COMMANDS.CONTENT_SCRIPT)
      await dealContentScript()
    return true
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(`[${SERVICE_WORKER_NAME}] >>> [bg] >> onCommand error: `, e)
    return true
  }
})

/**
 * 监听消息
 * @param message - 消息体
 * @param sender - 发送者信息
 */
browser.runtime.onMessage.addListener(async (message: Message.RuntimeMessage, sender: Runtime.MessageSender) => {
  try {
    const { type, name = '', tabId = '', data } = message
    // eslint-disable-next-line no-console
    console.log(`[${SERVICE_WORKER_NAME}] >>> [bg] >> onMessage > ${type}`, sender)
    switch (type) {
      case MESSAGE_TYPES.DEAL_ALARM: { // 前端请求，在后端执行定时任务
        const res = await AlarmService.dealAlarm(name)
        return isObject(res) ? res : true
      }
      case MESSAGE_TYPES.GET_PAGE_ALARM: { // 获取需要页面执行的定时任务
        return await AlarmTaskModel.query()
          .filter((item) => {
            return !item.deal_at || item.set_at > item.deal_at
          })
          .toArray()
      }
      case MESSAGE_TYPES.DEAL_PAGE_ALARM: { // 标记处理完成的定时任务
        return await AlarmTaskModel.alarmAction(name, 'deal')
      }
      case MESSAGE_TYPES.NEXT_TAB: { // 移动到下一个标签页
        let dealTabId = parseInt(tabId)
        if (!dealTabId && sender.tab?.id)
          dealTabId = sender.tab.id
        return await nextTab(dealTabId)
      }
      case MESSAGE_TYPES.DEAL_CONTENT_SCRIPT: { // 处理内容脚本
        return true
      }
      case MESSAGE_TYPES.SEARCH_HISTORY: { // 搜索浏览历史
        const { text, startTime, maxResults = 20 } = data
        // eslint-disable-next-line no-console
        console.log('[ data ] >', text, startTime, data)
        const searchRes = await browser.history.search({
          text,
          startTime,
          maxResults,
        })
        // eslint-disable-next-line no-console
        console.log('[ searchRes ] >', searchRes)
        return searchRes
      }
      case MESSAGE_TYPES.RECENT_BOOKMARKS: { // 最近改动书签
        const { count = 20 } = data
        return await browser.bookmarks.getRecent(count)
      }
      case MESSAGE_TYPES.SEARCH_BOOKMARKS: { // 搜索书签
        const { query } = data
        return await browser.bookmarks.search({
          query,
        })
      }
      default:
        return true
    }
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(`[${SERVICE_WORKER_NAME}] >>> [bg] >> onMessage error: `, e)
    return true
  }
})

export {}
