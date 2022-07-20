import type { Tabs } from 'webextension-polyfill'
import type { message } from '@localTypes/message'
import _ from 'lodash-es'
import dayjs from 'dayjs'
import ConfigState from '@models/keyValue/configState'
import AlarmService from '@services/base/alarm'
import { toDesktop } from '@services/desktop'
import { getVersion } from './version'
import { changeMode } from './shortcuts'

const EXTENSION_NAME = 'Contea'
const EXTENSION_ID = browser.runtime.getURL('').replace(/chrome-extension:\/\/|\//g, '')
const SERVICE_WORKER_NAME = `${EXTENSION_NAME}-${EXTENSION_ID}-${new Date().getTime()}-${_.random(10000, 99999)}`
const DEV_VERSION_KEY = 'DEV_VERSION'
const DEV_ALARM_NAME = 'DEV_WATCH'

/**
 * 初始化
 */
browser.runtime.onInstalled.addListener(async() => {
  try {
    // eslint-disable-next-line no-console
    console.log(`[${SERVICE_WORKER_NAME}] > [bg] > onInstalled`)

    const version = await getVersion()

    // eslint-disable-next-line no-console
    console.log(`[${SERVICE_WORKER_NAME}] > [bg] > version > ${JSON.stringify(version)}`)

    if (version.isDev) {
      await browser.storage.local.set({ [DEV_VERSION_KEY]: version })
      await browser.alarms.create(
        DEV_ALARM_NAME,
        {
          periodInMinutes: 0.1,
        })
    }

    await ConfigState.init()
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(`>>> [${SERVICE_WORKER_NAME}] >> [bg] > onInstalled error`, e)
  }
})

/**
 * 监听定时任务
 * @param alarm string - 定时任务信息
 * - @param name string - 定时任务名称
 */
browser.alarms.onAlarm.addListener(async(alarm: { name: string }) => {
  try {
    const { name } = alarm

    // eslint-disable-next-line no-console
    console.log(`[${SERVICE_WORKER_NAME}] > [bg] > onAlarm > ${JSON.stringify(alarm)}`)

    // 开发模式
    if (name === DEV_ALARM_NAME) {
      const currentVersion = await getVersion()
      const storage = await browser.storage.local.get([DEV_VERSION_KEY])
      const oldVersion = storage[DEV_VERSION_KEY]

      toDesktop(DEV_ALARM_NAME, { now: dayjs().format('HH:mm:ss') })

      if (currentVersion.version === oldVersion.version)
        return

      await browser.storage.local.set({ [DEV_VERSION_KEY]: currentVersion })

      if (currentVersion.type === 'background') // 暂不处理 background 更新
        return

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

    // 直接处理的模块
    if (['base', 'v2ex', 'sspai', 'movie'].includes(name)) {
      await AlarmService.dealAlarm(name)
    }

    // 需前端页面处理的模块，发送消息到页面在进行处理
    // 如果存在多个扩展页面，优先发送给激活状态页面，其他页面仅做同步
    // 页面根据请求提交到后台，后台处理后返回结果，绕一圈主要是需要页面的 DOM 处理能力
    else {
      const extensionTabs: Tabs.Tab[] = []
      const tabs = await browser.tabs.query({})

      if (!Object.keys(tabs).length) return

      const idReg = new RegExp(`/.*${EXTENSION_ID}.*/`)
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
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(`[${SERVICE_WORKER_NAME}] > [bg] > onAlarm error`, e)
  }
})

/**
 * 监听扩展绑定的快捷键
 * @param command string - 快捷键名称
 */
browser.commands.onCommand.addListener(async(command: string) => {
  try {
    if (command === 'change-mode')
      changeMode(EXTENSION_ID)
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(`[${SERVICE_WORKER_NAME}] > [bg] > onCommand error`, e)
  }
})

export {}
