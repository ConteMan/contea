<template>
  <Layout></Layout>
</template>
<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import Layout from '../layout/Index.vue'

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
useEventListener(window, 'keydown', (e: any) => {
  // eslint-disable-next-line no-console
  console.log(e.key)

  if (e.key === 'Tab')
    notice(e.key)
})
</script>
