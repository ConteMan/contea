<template>
  <div class="app-content-container max-h-screen min-h-screen overflow-y-auto">
    <router-view />
  </div>
  <SearchModal />
  <SettingDrawer />
</template>
<script setup lang="ts">
import { useEventListener, useActiveElement } from '@vueuse/core'
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

browser.runtime.onMessage.addListener(async(message, sender) => {
  if (message.data === 'change-mode')
    changeMode()

  return 'success'
})

const modalState = useModalState()

const activeElement = useActiveElement()
const notUsingInput = computed(() =>
  activeElement.value?.tagName !== 'INPUT'
  && activeElement.value?.tagName !== 'TEXTAREA',
)

useEventListener(window, 'keyup', (e: any) => {
  // 搜索
  if (e.key === searchKey && notUsingInput.value)
    modalState.change(true)

  // 模块、禅模式切换
  if (e.key === zenKey && notUsingInput.value) // 非输入模式
    changeMode()

  if (e.key === settingKey && notUsingInput.value) {
    const newTabState = useNewTabState()
    newTabState.changeSettingDrawer()
  }
})
</script>
