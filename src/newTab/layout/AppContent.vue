<script setup lang="ts">
import type { alarmName, message } from '@localTypes/message'
import { useActiveElement, useEventListener } from '@vueuse/core'
import { sleep } from '@utils/index'

import AlarmService from '@services/base/alarm'

import SearchModal from '@newTab/components/search/Search.vue'
import SettingDrawer from '@newTab/views/setting/SettingDrawer.vue'

import { useModalState } from '@newTab/store/modal'
import { useNewTabState } from '@newTab/store/newTab'
import { useAlarmState } from '@newTab/store/alarm'

const SEARCH_KEY = 'q'
const ZEN_KEY = 'z'
const SETTING_KEY = 's'
const TAB_CHANGE_KEY = 'Tab'

const newTabState = useNewTabState()
const alarmState = useAlarmState()

const changeMode = () => {
  newTabState.changeLayoutMode()
}

// 监听消息
browser.runtime.onMessage.addListener(async (message: message, sender: any) => {
  const { type, name } = message

  newTabState.setLog(`${new Date()} [NewTab AppContent] 收到 [${sender.id}] 发来的信息：${JSON.stringify(message)}`)

  switch (type) {
    case 'change-mode':
      changeMode()
      break
    case 'alarm':
    case 'alarm-sync': {
      if (!name)
        break
      if (type === 'alarm') {
        await AlarmService.dealAlarm(name)
        await sleep(1000) // 处理后等待 1 秒再继续
      }
      alarmState.addAlarm(name as alarmName, 1) // 通过状态通知组件更新数据
      break
    }
    default:
      break
  }

  return { from: 'response from AppContent' }
})

const modalState = useModalState()

const activeElement = useActiveElement()
const notUsingInput = computed(() =>
  activeElement.value?.tagName !== 'INPUT'
  && activeElement.value?.tagName !== 'TEXTAREA',
)

// 监听按键 按下 事件（非输入模式下）
useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  // eslint-disable-next-line no-console
  console.log('>>> AppContent >> useEventListener > window keydown event', e.key)

  if (e.key === 'Enter' && notUsingInput.value) {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    return false
  }
})

// 监听按键 完成 事件（非输入模式下）
useEventListener(window, 'keyup', (e: KeyboardEvent) => {
  // eslint-disable-next-line no-console
  console.log('>>> AppContent >> useEventListener > window keyup event', e.key)

  if (e.key === 'Enter' && notUsingInput.value) {
    e.preventDefault()
    e.stopPropagation()
    return
  }

  // 搜索
  if (e.key === SEARCH_KEY && notUsingInput.value)
    modalState.change(true)

  // 模式切换
  if (e.key === ZEN_KEY && notUsingInput.value)
    changeMode()

  // 显示/隐藏设置
  if (e.key === SETTING_KEY && notUsingInput.value)
    newTabState.changeSettingDrawer()

  // 切换 Tab
  if (e.key === TAB_CHANGE_KEY && notUsingInput.value)
    newTabState.changeNextTab()
})
</script>

<template>
  <router-view />
  <SearchModal />
  <SettingDrawer />
</template>
