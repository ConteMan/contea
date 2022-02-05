<template>
  <Layout></Layout>
  <SearchModal />
</template>
<script setup lang="ts">
import { useEventListener, useActiveElement } from '@vueuse/core'
import Layout from '../layout/Index.vue'
import SearchModal from '~/components/search/Search.vue'

import { useModalState } from '~/store/modal'

const defaultPath = '/zen'
const modulePath = '/module'
const searchKey = 'q'
const zenKey = 'z'

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
const { show: showModal } = storeToRefs(modalState)
const showSearch = async() => {
  modalState.change(true)
}

const activeElement = useActiveElement()
const notUsingInput = computed(() =>
  activeElement.value?.tagName !== 'INPUT'
  && activeElement.value?.tagName !== 'TEXTAREA',
)

useEventListener(window, 'keyup', (e: any) => {
  // 搜索
  if (e.key === searchKey) {
    if (!showModal.value)
      showSearch()
  }

  // 模块、禅模式切换
  if (e.key === zenKey && notUsingInput.value) // 非输入模式
    changeMode()
})
</script>
