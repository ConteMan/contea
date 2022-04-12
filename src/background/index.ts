import _ from 'lodash-es'
import type { message } from '@localTypes/message'

import configState from '@models/keyValue/configState'
import AlarmService from '@services/base/alarm'

import type { Tabs } from 'webextension-polyfill'
import type { IVersion } from './version'
import { getVersion } from './version'

import { changeMode } from './shortcuts'

const appName = 'Contea'
const appServiceWorkerName = `${appName} - ${new Date().getTime()} - ${_.random(10000, 99999)}`
const devStateKey = 'DEV_VERSION'
const currentUrl = browser.runtime.getURL('')
const extensionId = currentUrl.replace(/chrome-extension:\/\/|\//g, '')

/**
 * 初始化
 */
browser.runtime.onInstalled.addListener(async() => {
  // eslint-disable-next-line no-console
  console.log(`[${appServiceWorkerName}] > [bg] > onInstalled`)

  const version: IVersion = await getVersion()

  // eslint-disable-next-line no-console
  console.log(`[${appServiceWorkerName}] > [bg] > version > ${JSON.stringify(version)}`)

  // 判断是否是开发版本
  if (version.isDev) {
    await browser.storage.local.set({ [devStateKey]: version })
    await browser.alarms.create(
      'DEV_WATCH',
      {
        periodInMinutes: 0.2,
      })
  }

  configState.init()
})

/**
 * 监听定时任务
 */
browser.alarms.onAlarm.addListener(async(alarm: { name: string }) => {
  const { name } = alarm

  // eslint-disable-next-line no-console
  console.log(`[${appServiceWorkerName}] > [bg] > alarm > ${JSON.stringify(alarm)}`)

  // 开发模式
  // 如果版本号不同，则刷新扩展相关页面
  if (name === 'DEV_WATCH') {
    const currentVersion = await getVersion()
    const storage = await browser.storage.local.get([devStateKey])
    const oldVersion = storage[devStateKey]

    if (currentVersion.version === oldVersion.version) return

    browser.storage.local.set({ [devStateKey]: currentVersion })

    if (currentVersion.type === 'background') return

    const tabs = await browser.tabs.query({ })
    if (!Object.keys(tabs).length) return

    const idReg = new RegExp(`/.*${extensionId}.*/`)
    tabs.forEach((item: any) => {
      if (item?.url && (idReg.test(item.url) || /chrome:\/\/newtab.*/.test(item.url)))
        browser.tabs.reload(item.id)
    })

    return
  }

  if (name === 'base')
    await AlarmService.alarmDeal(name)

  // 发送消息到页面
  // 如果存在多个扩展页面，优先发送给激活状态页面，其他页面仅做同步
  if (name !== 'base') {
    const extensionTabs: Tabs.Tab[] = []
    const tabs = await browser.tabs.query({ })

    if (!Object.keys(tabs).length) return

    const idReg = new RegExp(`/.*${extensionId}.*/`)
    tabs.filter((item: Tabs.Tab) => {
      return item?.url && (idReg.test(item.url) || /chrome:\/\/newtab.*/.test(item.url))
    }).forEach((item: Tabs.Tab) => {
      item.active ? extensionTabs.splice(0, 0, item) : extensionTabs.push(item) // 激活的标签页放在最前面
    })

    if (!extensionTabs.length) return

    let message: message = { type: 'alarm', name }
    await browser.tabs.sendMessage(extensionTabs[0].id as number, message)
    extensionTabs.shift()

    if (!extensionTabs.length) return

    message = { type: 'alarm-sync', name } // 同步消息
    extensionTabs.every((item: Tabs.Tab) => {
      browser.tabs.sendMessage(item.id as number, message)
      return true
    })
  }
})

/**
 * 监听扩展绑定的快捷键
 */
browser.commands.onCommand.addListener(async(command: string) => {
  if (command === 'change-mode')
    changeMode(extensionId)
})

export {}
