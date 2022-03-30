<template>
  <router-view />
  <SearchModal />
  <SettingDrawer />
</template>
<script setup lang="ts">
import { useActiveElement, useEventListener } from '@vueuse/core'
import SearchModal from '~/components/search/Search.vue'
import SettingDrawer from '~/components/setting/SettingDrawer.vue'

import { useModalState } from '~/store/modal'
import { useNewTabState } from '~/store/newTab'

const defaultPath = '/zen'
const modulePath = '/module'
const searchKey = 'q'
const zenKey = 'z'
const settingKey = 's'

const router = useRouter()
const route = useRoute()

const changeMode = () => {
  const path = route.path === defaultPath ? modulePath : defaultPath
  router.push({ path })
}

// 监听快捷键
browser.runtime.onMessage.addListener(async(message: any, sender: any) => {
  // eslint-disable-next-line no-console
  console.log('[AppContent receive]>', message, sender)
  if (message.data === 'change-mode')
    changeMode()

  return { from: 'response from AppContent' }
})

const modalState = useModalState()

const activeElement = useActiveElement()
const notUsingInput = computed(() =>
  activeElement.value?.tagName !== 'INPUT'
  && activeElement.value?.tagName !== 'TEXTAREA',
)

// 显示/隐藏设置抽屉
const changeSettingDrawer = () => {
  const newTabState = useNewTabState()
  newTabState.changeSettingDrawer()
}

useEventListener(window, 'keyup', (e: any) => {
  // 搜索
  if (e.key === searchKey && notUsingInput.value)
    modalState.change(true)

  // 模块、禅模式切换
  if (e.key === zenKey && notUsingInput.value) // 非输入模式
    changeMode()

  if (e.key === settingKey && notUsingInput.value)
    changeSettingDrawer()
})
</script>
