import type { message } from '@localTypes/message'

import configState from '@models/keyValue/configState'
import AlarmService from '@services/base/alarm'

import type { Tabs } from 'webextension-polyfill'
import type { IVersion } from './version'
import { getVersion } from './version'

import { changeMode } from './shortcuts'

// const serviceWorkerId = `serviceWorker - ${new Date().getTime()} - ${Math.random()}`
const devStateKey = 'DEV_VERSION'
const currentUrl = browser.runtime.getURL('')
const extensionId = currentUrl.replace(/chrome-extension:\/\/|\//g, '')

/**
 * 初始化
 */
browser.runtime.onInstalled.addListener(async() => {
  // eslint-disable-next-line no-console
  console.log('[bg] > onInstalled')

  const version: IVersion = await getVersion()

  // eslint-disable-next-line no-console
  console.log(`[bg] > version > ${JSON.stringify(version)} ...`)

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
  // console.log(`[${serviceWorkerId}] > onAlarm > ${name}`)

  // 开发模式
  if (name === 'DEV_WATCH') {
    const currentVersion = await getVersion()
    const storage = await browser.storage.local.get([devStateKey])
    const oldVersion = storage[devStateKey]

    if (currentVersion.version !== oldVersion.version) {
      browser.storage.local.set({ [devStateKey]: currentVersion })
      if (currentVersion.type !== 'background') {
        const tabs = await browser.tabs.query({ })
        if (Object.keys(tabs).length) {
          tabs.forEach((item: any) => {
            const idReg = new RegExp(`/.*${extensionId}.*/`)
            if (item?.url && (idReg.test(item.url) || /chrome:\/\/newtab.*/.test(item.url)))
              browser.tabs.reload(item.id)
          })
        }
      }
    }
    return
  }

  if (name === 'base') {
    await AlarmService.alarmDeal(name)
  }
  else {
    const extensionTabs: Tabs.Tab[] = []
    const tabs = await browser.tabs.query({ })
    if (Object.keys(tabs).length) {
      tabs.forEach((item: any) => {
        const idReg = new RegExp(`/.*${extensionId}.*/`)
        if (item?.url && (idReg.test(item.url) || /chrome:\/\/newtab.*/.test(item.url)))
          item.active ? extensionTabs.splice(0, 0, item) : extensionTabs.push(item)
      })

      if (extensionTabs.length > 0) {
        let message: message = { type: 'alarm', name }
        await browser.tabs.sendMessage(extensionTabs[0].id as number, message)
        extensionTabs.shift()
        if (extensionTabs.length) {
          message = { type: 'alarm-sync', name }
          extensionTabs.every((item: Tabs.Tab) => {
            browser.tabs.sendMessage(item.id as number, message)
            return true
          })
        }
      }
    }
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
