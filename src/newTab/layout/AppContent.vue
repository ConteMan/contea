<template>
  <router-view />
  <SearchModal />
  <SettingDrawer />
</template>
<script setup lang="ts">
import type { alarmName, message } from '@localTypes/message'
import { useActiveElement, useEventListener } from '@vueuse/core'
import { sleep } from '@utils/index'

import AlarmService from '@services/base/alarm'

import SearchModal from '@newTab/components/search/Search.vue'
import SettingDrawer from '@newTab/components/setting/SettingDrawer.vue'

import { useModalState } from '@newTab/store/modal'
import { useNewTabState } from '@newTab/store/newTab'
import { useAlarmState } from '@newTab/store/alarm'

const defaultPath = '/index'
const searchKey = 'q'
const zenKey = 'z'
const settingKey = 's'

const router = useRouter()
const route = useRoute()

const changeMode = () => {
  const path = defaultPath
  router.push({ path })
}

const newTabState = useNewTabState()
const alarmState = useAlarmState()

// 监听消息
browser.runtime.onMessage.addListener(async(message: message, sender: any) => {
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

// 监听按键事件
useEventListener(window, 'keyup', (e: any) => {
  // 搜索
  if (e.key === searchKey && notUsingInput.value)
    modalState.change(true)

  // 模块、禅模式切换
  if (e.key === zenKey && notUsingInput.value) // 非输入模式
    changeMode()

  // 显示/隐藏设置抽屉
  if (e.key === settingKey && notUsingInput.value)
    newTabState.changeSettingDrawer()
})
</script>
