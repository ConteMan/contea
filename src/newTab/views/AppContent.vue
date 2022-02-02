<template>
  <Layout></Layout>
  <SearchModal />
</template>
<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import Layout from '../layout/Index.vue'
import SearchModal from '~/components/search/Search.vue'

import { useModalState } from '~/store/modal'

const router = useRouter()

browser.runtime.onMessage.addListener(async(message, sender) => {
  if (message.data === 'change-mode')
    router.push({ path: '/home' })

  return 'success'
})

const modalState = useModalState()
const { show: showModal } = storeToRefs(modalState)
const showSearch = async() => {
  modalState.change(true)
}

useEventListener(window, 'keyup', (e: any) => {
  if (e.key === 'q') {
    if (!showModal.value)
      showSearch()
  }
})
</script>
