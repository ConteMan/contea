<script setup lang="ts">
import type { alarmName, message } from '@localTypes/message'
import { MESSAGE_TYPES } from '@enums/index'

import { useActiveElement, useEventListener } from '@vueuse/core'
import { sendToBackground, sleep } from '@utils/index'

import SearchModal from '@newTab/components/search/Search.vue'
import SettingDrawer from '@newTab/views/setting/SettingDrawer.vue'

import AlarmService from '@services/base/alarm'
import { useAlarmState, useModalState, useNewTabState } from '@newTab/store/index'

const SEARCH_KEY = 'q'
const ZEN_KEY = 'z'
const SETTING_KEY = 's'
const TAB_CHANGE_KEY = 'Tab'

const NewTabStore = useNewTabState()
const AlarmStore = useAlarmState()

const changeMode = () => {
  NewTabStore.changeLayoutMode()
}

interface AlarmItem {
  name: string
  [other: string]: any
}
type Alarm = AlarmItem[]

// 查询未处理的定时任务
const dealAlarm = async () => {
  const alarms: Alarm = await sendToBackground({
    type: MESSAGE_TYPES.GET_PAGE_ALARM,
  })
  if (!alarms || !alarms.length)
    return

  for (let i = 0; i < alarms.length; i++) {
    await AlarmService.dealAlarm(alarms[i].name, 'page')
    await sendToBackground({
      type: MESSAGE_TYPES.DEAL_PAGE_ALARM,
      name: alarms[i].name,
    })
  }
}
dealAlarm()

// 监听消息
browser.runtime.onMessage.addListener(async (message: message, sender: any) => {
  const { type, name } = message

  // eslint-disable-next-line no-console
  console.log(`${new Date()} [NewTab AppContent] 收到 [${sender.id}] 发来的信息：${JSON.stringify(message)}`)

  NewTabStore.setLog(`${new Date()} [NewTab AppContent] 收到 [${sender.id}] 发来的信息：${JSON.stringify(message)}`)

  switch (type) {
    case 'change-mode':
      changeMode()
      break
    case 'alarm':
    case 'alarm-sync': {
      if (!name)
        break
      if (type === 'alarm') {
        await AlarmService.dealAlarm(name, 'page')
        await sleep(1000) // 处理后等待 1 秒再继续
      }
      AlarmStore.addAlarm(name as alarmName, 1) // 通过状态通知组件更新数据
      break
    }
    default:
      break
  }
})

const ModalStore = useModalState()

const activeElement = useActiveElement()
const notUsingInput = computed(() =>
  activeElement.value?.tagName !== 'INPUT'
  && activeElement.value?.tagName !== 'TEXTAREA',
)

// 监听按键 按下 事件（非输入模式下）
useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter' && notUsingInput.value) {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    return false
  }
})

// 监听按键 完成 事件（非输入模式下）
useEventListener(window, 'keyup', (e: KeyboardEvent) => {
  if (e.key === 'Enter' && notUsingInput.value) {
    e.preventDefault()
    e.stopPropagation()
    return
  }

  // 搜索
  if (e.key === SEARCH_KEY && notUsingInput.value)
    ModalStore.change(true)

  // 模式切换
  if (e.key === ZEN_KEY && notUsingInput.value)
    changeMode()

  // 显示/隐藏设置
  if (e.key === SETTING_KEY && notUsingInput.value)
    NewTabStore.changeSettingDrawer()

  // 切换 Tab
  if (e.key === TAB_CHANGE_KEY && notUsingInput.value) {
    if (e.shiftKey)
      NewTabStore.changePreTab()
    else
      NewTabStore.changeNextTab()
  }
})
</script>

<template>
  <router-view />
  <SearchModal />
  <SettingDrawer />
</template>
