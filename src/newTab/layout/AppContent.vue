<script setup lang="ts">
import { MESSAGE_TYPES } from '@enums/index'

import { useActiveElement, useEventListener } from '@vueuse/core'
import { moveToTab, nextTab, preTab, sendToBackground, sleep } from '@utils/index'

import SearchModal from '@newTab/components/search/Search.vue'

import AlarmService from '@services/base/alarm'
import { useModalState, useNewTabState } from '@newTab/store/index'
import SettingDrawer from '~/newTab/views/setting/Index.vue'

const SEARCH_KEY = ['q', 't', 'go']
const ZEN_KEY = 'z'
const SETTING_KEY = 's'
const TAB_CHANGE_KEY = 'Tab'
const GO_TO_PRE_TAB_KEY = 'E'
const GO_TO_NEXT_TAB_KEY = 'R'
const MOVE_TO_LEFT_TAB_KEY = '<<'
const MOVE_TO_RIGHT_TAB_KEY = '>>'
const USED_KEY_ARRAY = ['>', '<', 'g', 'o']

const ModalStore = useModalState()
const { show: SearchModalShow } = storeToRefs(ModalStore)

const NewTabStore = useNewTabState()
const { layoutMode, hasInit } = storeToRefs(NewTabStore)

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

const commandStr = ref('')

// 监听消息
browser.runtime.onMessage.addListener(async (message: Message.TabMessage, sender: any) => {
  const { type } = message

  // eslint-disable-next-line no-console
  console.log(`${new Date()} [NewTab AppContent] 收到 [${sender.id}] 发来的信息：${JSON.stringify(message)}`)

  NewTabStore.setLog(`${new Date()} [NewTab AppContent] 收到 [${sender.id}] 发来的信息：${JSON.stringify(message)}`)

  switch (type) {
    case 'change-mode': {
      changeMode()
      break
    }
    case 'search': {
      ModalStore.change(true)
      break
    }
    case 'alarm':
    case 'alarm-sync': {
      const { name = '' } = message
      if (!name)
        break
      if (type === 'alarm') {
        await AlarmService.dealAlarm(name, 'page')
        await sleep(1000) // 处理后等待 1 秒再继续
      }
      break
    }
    case MESSAGE_TYPES.NEXT_TAB: {
      const { tabId = 0 } = message
      let dealTabId = parseInt(tabId)
      if (!dealTabId && sender.tab?.id)
        dealTabId = sender.tab.id
      return await nextTab(dealTabId)
    }
    case MESSAGE_TYPES.DEAL_CONTENT_SCRIPT: {
      return true
    }
    case MESSAGE_TYPES.SEARCH_HISTORY: {
      const { data } = message
      const { text, startTime, maxResults = 20 } = data
      // eslint-disable-next-line no-console
      console.log('[ data ] >', text, startTime, data)
      const searchRes = await browser.history.search({
        text,
        startTime,
        maxResults,
      })
      // eslint-disable-next-line no-console
      console.log('[ newTab searchRes ] >', searchRes)
      return searchRes
    }
    case MESSAGE_TYPES.RECENT_BOOKMARKS: {
      const { data } = message
      const { count = 20 } = data
      return await browser.bookmarks.getRecent(count)
    }
    case MESSAGE_TYPES.SEARCH_BOOKMARKS: {
      const { data } = message
      const { query } = data
      return await browser.bookmarks.search({
        query,
      })
    }
    default:
      break
  }
})

const activeElement = useActiveElement()
const notUsingInput = computed(() =>
  activeElement.value?.tagName !== 'INPUT'
  && activeElement.value?.tagName !== 'TEXTAREA',
)

// 监听按键 按下 事件（非输入模式下）
useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  if (!notUsingInput.value)
    return

  if (e.key === 'Enter') {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    return false
  }
})

// 监听按键 完成 事件（非输入模式下）
useEventListener(window, 'keyup', async (e: KeyboardEvent) => {
  if (!notUsingInput.value) {
    if (commandStr.value) // 在输入内容后清空命令监听
      commandStr.value = ''
    return
  }

  if (e.key === 'Escape') {
    commandStr.value = ''
    return
  }

  if (e.key === 'Enter') {
    e.preventDefault()
    e.stopPropagation()
    return
  }

  // 搜索
  if (SEARCH_KEY.includes(e.key)) {
    ModalStore.change(true)
    return
  }

  // 模式切换
  if (e.key === ZEN_KEY) {
    changeMode()
    return
  }

  // 显示/隐藏设置
  if (e.key === SETTING_KEY) {
    NewTabStore.changeSettingDrawer()
    return
  }

  // 切换到上一个标签页
  if (e.key === GO_TO_PRE_TAB_KEY) {
    preTab()
    return
  }

  // 切换到下一个标签页
  if (e.key === GO_TO_NEXT_TAB_KEY) {
    nextTab()
    return
  }

  // 切换 Tab
  if (e.key === TAB_CHANGE_KEY) {
    if (e.ctrlKey) { // 兼容 `Ctrl + Tab` 切换网页 Tab
      await nextTab()
      return
    }
    if (layoutMode.value === 'list') { // 世界线模式，侧边菜单切换
      if (e.shiftKey)
        NewTabStore.changePreTab()
      else
        NewTabStore.changeNextTab()
    }
    return
  }

  if (USED_KEY_ARRAY.includes(e.key))
    commandStr.value += e.key

  if (commandStr.value === MOVE_TO_LEFT_TAB_KEY) {
    commandStr.value = ''
    moveToTab('pre')
  }
  if (commandStr.value === MOVE_TO_RIGHT_TAB_KEY) {
    commandStr.value = ''
    moveToTab('next')
  }
  if (SEARCH_KEY.includes(commandStr.value)) {
    commandStr.value = ''
    ModalStore.change(true)
  }
})
</script>

<template>
  <!-- 通过隐藏背景内容，使切换到此页面时体验更好 -->
  <template v-if="!SearchModalShow && hasInit">
    <router-view />
  </template>
  <SearchModal />
  <SettingDrawer />
  <div class="show-command">
    {{ commandStr }}
  </div>
</template>

<style lang="less">
.show-command {
  position: fixed;
  right: 0;
  bottom: 0;
}
</style>
