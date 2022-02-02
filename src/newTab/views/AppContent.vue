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
const route = useRoute()

browser.runtime.onMessage.addListener(async(message, sender) => {
  // eslint-disable-next-line no-console
  console.log({ message, sender })
  if (message.data === 'change-mode')
    router.push({ path: route.path === '/simple' ? '/home' : '/simple' })

  return 'success'
})

const notification = useNotification()
const notice = (msg: any) => {
  notification.create({
    content: msg,
    duration: 10000,
  })
}

const modalState = useModalState()
const { show: showModal } = storeToRefs(modalState)
const showSearch = async() => {
  modalState.change(true)
}

useEventListener(window, 'keyup', (e: any) => {
  // eslint-disable-next-line no-console
  console.log(e)

  if (e.key === 'Tab')
    notice(e.key)
  if (e.key === 'q') {
    if (!showModal.value) {
      console.log(showModal.value)
      showSearch()
    }
  }
})
</script>
